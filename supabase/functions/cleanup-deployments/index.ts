import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Cleanup old deployments to save database space.
 * Deletes deployments older than 30 days.
 * 
 * Call this weekly via cron or manually.
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

        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Delete old deployments (keep last 30 days)
        const { count, error } = await supabaseAdmin
            .from('deployments')
            .delete({ count: 'exact' })
            .lt('created_at', thirtyDaysAgo.toISOString());

        if (error) {
            console.error("Cleanup error:", error);
            return new Response(
                JSON.stringify({ error: 'Failed to cleanup' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`🧹 Cleaned up ${count} old deployments`);

        return new Response(
            JSON.stringify({
                message: `Cleanup complete. Deleted ${count} deployments older than 30 days.`,
                deleted: count
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (err) {
        return new Response(
            JSON.stringify({ error: String(err) }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
