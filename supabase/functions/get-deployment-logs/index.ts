
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { deploymentId } = await req.json();

        if (!deploymentId) {
            return new Response(JSON.stringify({ error: 'Missing deploymentId' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get deployment details
        const { data: deployment, error: deployError } = await supabaseAdmin
            .from('deployments')
            .select('project_id, external_id')
            .eq('id', deploymentId)
            .single();

        if (deployError || !deployment) {
            return new Response(JSON.stringify({ error: 'Deployment not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        if (!deployment.external_id) {
            // For legacy deployments without ID
            return new Response(JSON.stringify({ error: 'No logs available for this deployment (Legacy)' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // 2. Get Integration Token
        const { data: integration, error: intError } = await supabaseAdmin
            .from('integrations')
            .select('config')
            .eq('project_id', deployment.project_id)
            .eq('provider', 'vercel')
            .single();

        if (intError || !integration || !integration.config?.token) {
            // Fallback: If no token found, we can't fetch logs.
            // Note: In a real app we might store a specialized token or use Oauth.
            // Here assuming we stored 'token' in config.
            return new Response(JSON.stringify({ error: 'Vercel integration not configured or missing token' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const token = integration.config.token;

        // 3. Proxy to Vercel API
        // https://vercel.com/docs/rest-api/endpoints/deployments#get-deployment-events
        const vercelUrl = `https://api.vercel.com/v2/deployments/${deployment.external_id}/events?direction=backward&limit=100`;

        const vercelRes = await fetch(vercelUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!vercelRes.ok) {
            const errorText = await vercelRes.text();
            return new Response(JSON.stringify({ error: `Vercel API Error: ${vercelRes.statusText}`, details: errorText }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const events = await vercelRes.json();

        return new Response(
            JSON.stringify({ logs: events }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
