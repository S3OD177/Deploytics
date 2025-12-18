
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

interface AlertPayload {
    project_id: string;
    event_type: string; // 'deployment.success' | 'deployment.failed'
    details: {
        commit_message: string;
        commit_hash: string;
        status: string;
        author?: string;
    };
}

Deno.serve(async (req) => {
    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const payload: AlertPayload = await req.json();
        const { project_id, event_type, details } = payload;

        // 1. Fetch active alert rules for this project and event type
        const { data: rules, error: rulesError } = await supabaseClient
            .from('alert_rules')
            .select('*')
            .eq('project_id', project_id)
            .eq('enabled', true)
            .contains('events', [event_type]);

        if (rulesError) throw rulesError;

        if (!rules || rules.length === 0) {
            return new Response(JSON.stringify({ message: 'No matching alert rules' }), { status: 200 });
        }

        const results = [];

        // 2. Dispatch to each rule's channel
        for (const rule of rules) {
            if (rule.channel_type === 'slack' && rule.config.webhook_url) {
                const slackRes = await fetch(rule.config.webhook_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: `📢 *Deploytics Alert*: ${details.status.toUpperCase()} deployment in project *${project_id}*\n> ${details.commit_message} (${details.commit_hash.substring(0, 7)})`
                    })
                });
                results.push({ channel: 'slack', status: slackRes.status });
            }

            if (rule.channel_type === 'email') {
                // Placeholder for email dispatch (e.g., via Resend or SendGrid)
                console.log(`Email alert for ${project_id}: ${details.commit_message}`);
                results.push({ channel: 'email', status: 'sent_placeholder' });
            }
        }

        return new Response(JSON.stringify({ results }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});
