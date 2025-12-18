
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
        // Initialize Supabase Client with Service Role to access all data
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get projects with weekly email enabled
        const { data: projects, error: projectsError } = await supabaseAdmin
            .from('projects')
            .select('id, name, user_id, settings')
            .filter('settings->>weekly_email_enabled', 'eq', 'true')

        if (projectsError) throw projectsError;

        const results = [];

        console.log(`Found ${projects?.length || 0} projects for weekly summary.`);

        // 2. Iterate and generate report
        for (const project of (projects || [])) {
            // Get Owner Email
            const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(project.user_id);

            if (userError || !user || !user.email) {
                console.warn(`Could not find user for project ${project.id}`);
                continue;
            }

            // Get Deployments for last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data: deployments, error: deploysError } = await supabaseAdmin
                .from('deployments')
                .select('status, created_at, environment')
                .eq('project_id', project.id)
                .gte('created_at', sevenDaysAgo.toISOString())

            if (deploysError) {
                console.error(`Error fetching deployments for ${project.name}:`, deploysError);
                continue;
            }

            // Calculate Stats
            const total = deployments?.length || 0;
            const success = deployments?.filter(d => d.status === 'success').length || 0;
            const failed = deployments?.filter(d => d.status === 'failed').length || 0;
            const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

            const report = {
                project: project.name,
                email: user.email,
                period: 'Last 7 Days',
                stats: { total, success, failed, successRate: `${successRate}%` }
            };

            results.push(report);

            // 3. Send Email (Mock)
            console.log(`[MOCK EMAIL] Sending Weekly Summary to ${user.email} for ${project.name}`);
            console.log(`Subject: Weekly Deployment Summary for ${project.name}`);
            console.log(`Body:
                Hi there!
                Here is your weekly summary for ${project.name}:
                
                - Total Deployments: ${total}
                - Success Rate: ${successRate}%
                - Failed: ${failed}
                
                Keep shipping!
                The Deploytics Team
            `);

            // TODO: Integrate Resend or SendGrid here
            // await fetch('https://api.resend.com/emails', ...)
        }

        return new Response(
            JSON.stringify({ message: 'Weekly summaries processed', results }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
