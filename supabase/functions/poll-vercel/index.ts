import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Poll Vercel API for recent deployments.
 * This is an alternative to Vercel webhooks (which require Pro plan).
 * 
 * To schedule this function:
 * 1. Deploy the function: `supabase functions deploy poll-vercel`
 * 2. Set up a cron job using pg_cron or an external scheduler to call this endpoint every 5 minutes.
 * 
 * Required Secrets:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get all Vercel integrations with tokens
        const { data: integrations, error: intError } = await supabaseAdmin
            .from('integrations')
            .select('id, project_id, config')
            .eq('provider', 'vercel')
            .eq('status', 'connected');

        if (intError) {
            console.error("Error fetching integrations:", intError);
            return new Response(JSON.stringify({ error: 'Failed to fetch integrations' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (!integrations || integrations.length === 0) {
            return new Response(JSON.stringify({ message: 'No Vercel integrations found' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        let totalSynced = 0;
        const errors: string[] = [];

        for (const integration of integrations) {
            const config = integration.config as { access_token?: string; project_id?: string };
            const accessToken = config?.access_token;
            const vercelProjectId = config?.project_id;

            if (!accessToken || !vercelProjectId) {
                console.warn(`Skipping integration ${integration.id}: missing token or project_id`);
                continue;
            }

            try {
                // 2. Fetch recent deployments from Vercel API
                const vercelRes = await fetch(
                    `https://api.vercel.com/v6/deployments?projectId=${vercelProjectId}&limit=10`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!vercelRes.ok) {
                    const errText = await vercelRes.text();
                    console.error(`Vercel API error for project ${vercelProjectId}: ${errText}`);
                    errors.push(`Project ${vercelProjectId}: ${vercelRes.status}`);
                    continue;
                }

                const vercelData = await vercelRes.json();
                const deployments = vercelData.deployments || [];

                for (const dep of deployments) {
                    // 3. Check if deployment already exists
                    const { data: existing } = await supabaseAdmin
                        .from('deployments')
                        .select('id')
                        .eq('external_id', dep.uid)
                        .single();

                    if (existing) {
                        // Deployment already synced, skip
                        continue;
                    }

                    // 4. Calculate status and duration
                    const status = dep.state === 'READY' ? 'success'
                        : dep.state === 'ERROR' ? 'failed'
                            : dep.state === 'BUILDING' ? 'building'
                                : 'pending';

                    const createdAt = new Date(dep.created);
                    const readyAt = dep.ready ? new Date(dep.ready) : new Date();
                    const durationSeconds = Math.round((readyAt.getTime() - createdAt.getTime()) / 1000);
                    const estimatedCost = (durationSeconds / 60) * 0.01; // $0.01/min

                    // 5. Insert new deployment
                    const { error: insertError } = await supabaseAdmin
                        .from('deployments')
                        .insert({
                            project_id: integration.project_id,
                            status: status,
                            commit_message: dep.meta?.githubCommitMessage || 'Deployment',
                            commit_hash: dep.meta?.githubCommitSha,
                            branch: dep.meta?.githubCommitRef || 'main',
                            environment: dep.target || 'production',
                            external_id: dep.uid,
                            duration_seconds: durationSeconds,
                            cost: estimatedCost,
                            created_at: createdAt.toISOString(),
                        });

                    if (insertError) {
                        console.error(`Failed to insert deployment ${dep.uid}:`, insertError);
                    } else {
                        totalSynced++;
                        console.log(`✅ Synced deployment ${dep.uid} for project ${integration.project_id}`);
                    }
                }
            } catch (fetchErr) {
                console.error(`Error processing integration ${integration.id}:`, fetchErr);
                errors.push(`Integration ${integration.id}: ${fetchErr}`);
            }
        }

        return new Response(
            JSON.stringify({
                message: `Polling complete. Synced ${totalSynced} new deployments.`,
                integrations_checked: integrations.length,
                errors: errors.length > 0 ? errors : undefined
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (err) {
        console.error("Polling error:", err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
})
