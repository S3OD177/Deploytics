
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vercel-signature',
}

function hexToUint8Array(hexString: string) {
    return new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const signature = req.headers.get("x-vercel-signature");
        if (!signature) {
            return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const secret = Deno.env.get('VERCEL_WEBHOOK_SECRET');
        if (secret) {
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
                "raw",
                encoder.encode(secret),
                { name: "HMAC", hash: "SHA-1" },
                false,
                ["verify"]
            );

            const rawBody = await req.clone().text(); // Need raw text for verification
            const verified = await crypto.subtle.verify(
                "HMAC",
                key,
                hexToUint8Array(signature),
                encoder.encode(rawBody)
            );

            if (!verified) {
                return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
        } else {
            console.warn("Skipping signature verification: VERCEL_WEBHOOK_SECRET not set");
        }

        const body = await req.json();

        if (body.type !== 'deployment.created' && body.type !== 'deployment.error' && body.type !== 'deployment.ready') {
            return new Response(JSON.stringify({ message: 'Ignored event type' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const payload = body.payload;
        const vercelProjectId = payload.projectId;

        // 1. Find internal project_id
        const { data: integration, error: integrationError } = await supabaseAdmin
            .from('integrations')
            .select('project_id')
            .eq('provider', 'vercel')
            // This relies on config having project_id. If using different structure, adjust.
            // Using filter for JSONB column
            .filter('config->>project_id', 'eq', vercelProjectId)
            .single();

        if (integrationError || !integration) {
            console.warn(`No integration found for Vercel Project ID: ${vercelProjectId}`);
            // Return 200 to acknowledge webhook even if we can't process it (to prevent retries)
            return new Response(JSON.stringify({ message: 'Project not linked' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const projectId = integration.project_id;
        const status = body.type === 'deployment.error' ? 'failed' : (body.type === 'deployment.ready' ? 'success' : 'building');

        // 2. Insert Deployment
        // 2. Insert Deployment
        const createdAt = new Date(payload.deployment?.created || Date.now());
        const durationSeconds = (Date.now() - createdAt.getTime()) / 1000;
        const durationMinutes = durationSeconds / 60;
        const estimatedCost = durationMinutes * 0.01; // $0.01 per minute (Commercial rate assumption)

        const deploymentData = {
            project_id: projectId,
            status: status,
            commit_message: payload.deployment?.meta?.githubCommitMessage || 'Manual Deployment',
            commit_hash: payload.deployment?.meta?.githubCommitSha,
            branch: payload.deployment?.meta?.githubCommitRef,
            environment: payload.target || 'production',
            external_id: payload.deployment?.id || payload.id,
            duration_seconds: Math.round(durationSeconds),
            cost: Number(estimatedCost.toFixed(4)),
            created_at: createdAt.toISOString()
        };

        const { data: deployment, error: insertError } = await supabaseAdmin
            .from('deployments')
            .insert(deploymentData)
            .select() // Return the inserted row
            .single();

        if (insertError) {
            console.error('Failed to insert deployment:', insertError);
            throw insertError;
        }

        // Fetch Project details for Org ID (needed for Audit Logs)
        const { data: projectData } = await supabaseAdmin
            .from('projects')
            .select('organization_id, name')
            .eq('id', projectId)
            .single();

        // 3. Insert Audit Log
        if (projectData?.organization_id) {
            try {
                await supabaseAdmin.from('audit_logs').insert({
                    organization_id: projectData.organization_id,
                    action: `deployment.${status}`, // deployment.success, deployment.failed
                    resource: deployment.id, // ID of the new deployment
                    metadata: {
                        project_name: projectData.name,
                        branch: deploymentData.branch,
                        commit: deploymentData.commit_hash,
                        cost: deploymentData.cost
                    }
                });
            } catch (err) {
                console.error("Failed to insert audit log:", err);
                // Non-blocking
            }
        }

        // 4. Process Alerts (Enriched)
        if (status === 'success' || status === 'failed') {
            const eventType = status === 'failed' ? 'deployment.failed' : 'deployment.success';

            // Note: Schema should allow 'events' array. Using 'contains' for JSONB/Array support.
            const { data: rules } = await supabaseAdmin
                .from('alert_rules')
                .select('*')
                .eq('project_id', projectId)
                .eq('enabled', true)
                .contains('events', [eventType]);

            if (rules && rules.length > 0) {
                for (const rule of rules) {
                    try {
                        if (rule.channel_type === 'slack') {
                            const webhookUrl = rule.config?.webhook_url;
                            if (webhookUrl) {
                                // Rich Block Kit Message
                                const color = status === 'success' ? '#10b981' : '#ef4444';
                                const emoji = status === 'success' ? '✅' : '🚨';
                                const title = `${emoji} Deployment ${status.toUpperCase()}: ${projectData?.name || projectId}`;

                                const blocks = {
                                    blocks: [
                                        {
                                            type: "header",
                                            text: {
                                                type: "plain_text",
                                                text: title,
                                                emoji: true
                                            }
                                        },
                                        {
                                            type: "section",
                                            fields: [
                                                {
                                                    type: "mrkdwn",
                                                    text: `*Branch:*\n${deploymentData.branch}`
                                                },
                                                {
                                                    type: "mrkdwn",
                                                    text: `*Duration:*\n${deploymentData.duration_seconds}s`
                                                },
                                                {
                                                    type: "mrkdwn",
                                                    text: `*Commit:*\n<https://github.com/search?q=${deploymentData.commit_hash}|${deploymentData.commit_hash?.substring(0, 7) || 'N/A'}>`
                                                },
                                                {
                                                    type: "mrkdwn",
                                                    text: `*Cost:*\n$${deploymentData.cost}`
                                                }
                                            ]
                                        },
                                        {
                                            type: "section",
                                            text: {
                                                type: "mrkdwn",
                                                text: `*Message:*\n${deploymentData.commit_message}`
                                            }
                                        }
                                    ]
                                };

                                await fetch(webhookUrl, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(blocks)
                                });
                            }
                        }
                        // Add Discord/Email handlers here if needed (similar logic)
                    } catch (e) {
                        console.error('Failed to send alert:', e);
                    }
                }
            }
        }

        console.log(`Processed Vercel Webhook: ${body.type} for Project ${projectId}`);

        return new Response(
            JSON.stringify({ message: 'Webhook processed', data: deployment }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
