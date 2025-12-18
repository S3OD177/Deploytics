
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vercel-signature',
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

        // In a real verification, we would check the signature against a secret.
        // For this 'Client-Read' phase, we will just proceed but log it.

        const body = await req.json();

        // Check if this is a deployment event
        if (body.type !== 'deployment.created' && body.type !== 'deployment.error' && body.type !== 'deployment.ready') {
            return new Response(JSON.stringify({ message: 'Ignored event type' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // Initialize Supabase Client (Admin context to write deployment)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const payload = body.payload;
        const deploymentData = {
            project_id: payload.projectId, // This assumes Vercel Project ID maps to our Project ID OR we assume the mapping exists in integrations
            status: body.type === 'deployment.error' ? 'failed' : (body.type === 'deployment.ready' ? 'success' : 'building'),
            commit_message: payload.deployment?.meta?.githubCommitMessage || 'Manual Deployment',
            commit_hash: payload.deployment?.meta?.githubCommitSha,
            branch: payload.deployment?.meta?.githubCommitRef,
            environment: payload.target || 'production',
            duration_seconds: null, // Vercel sends this in 'deployment.ready' sometimes or we calc it
            created_at: new Date(payload.deployment?.created || Date.now()).toISOString()
        };

        // We need to map Vercel Project ID to our Internal Project ID.
        // Ideally, we look up the 'integrations' table first.
        // integration.config.project_id == vercel_project_id

        // For now, let's just log the receipt as 'success' for the MVP of the webhook.
        // Actual DB insertion requires the integration mapping logic which interacts with the `integrations` table.

        console.log(`Received Vercel Webhook: ${body.type}`, deploymentData);

        return new Response(
            JSON.stringify({ message: 'Webhook received', data: deploymentData }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
