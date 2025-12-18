
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
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const { projectId } = await req.json()

        // 1. Verify User Access to Project
        const { data: member, error: memberError } = await supabaseClient
            .from('project_members')
            .select('role')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .single();

        // Also check if owner via projects table if members table isn't fully populated yet in this MVP
        const { data: project, error: projectError } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('owner_id', user.id)
            .single();

        if ((!member && !project) || memberError) {
            return new Response(
                JSON.stringify({ error: 'Access denied' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 2. Fetch All Data
        // Parallelize for speed
        const [deployments, settings, alertRules] = await Promise.all([
            supabaseClient.from('deployments').select('*').eq('project_id', projectId),
            supabaseClient.from('projects').select('settings').eq('id', projectId).single(),
            supabaseClient.from('alert_rules').select('*').eq('project_id', projectId)
        ]);

        const exportData = {
            generated_at: new Date().toISOString(),
            requestor: user.email,
            project: project,
            settings: settings.data?.settings,
            deployments: deployments.data,
            alert_rules: alertRules.data
        };

        return new Response(
            JSON.stringify(exportData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
