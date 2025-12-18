
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

        const { projectId } = await req.json()

        // Fetch Deployments
        const { data: deployments } = await supabaseClient
            .from('deployments')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (!deployments) return new Response(JSON.stringify({}), { headers: corsHeaders });

        const newBadges = [];
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        if (!userId) throw new Error("No user found");

        // 1. Check for "Night Owl" (Deploy between 12 AM and 4 AM)
        const nightOwlDeployment = deployments.find(d => {
            const hour = new Date(d.created_at).getHours();
            return hour >= 0 && hour < 4;
        });

        if (nightOwlDeployment) {
            newBadges.push({ badge_id: 'night-owl', metadata: { trigger: nightOwlDeployment.id } });
        }

        // 2. Check for "Speed Demon" (Duration < 30s)
        const speedDemon = deployments.find(d => d.duration_seconds && d.duration_seconds < 30);
        if (speedDemon) {
            newBadges.push({ badge_id: 'speed-demon', metadata: { duration: speedDemon.duration_seconds } });
        }

        // 3. Award Badges
        for (const badge of newBadges) {
            await supabaseClient.rpc('award_badge', {
                p_user_id: userId,
                p_badge_id: badge.badge_id,
                p_metadata: badge.metadata
            });
        }

        // 4. Calculate Predictions (Mocked for Demo)
        const predictions = [
            {
                project_id: projectId,
                prediction_type: 'velocity',
                confidence: 0.85,
                payload: { message: "You are on track to ship 15% more features this week." }
            },
            {
                project_id: projectId,
                prediction_type: 'risk',
                confidence: 0.12,
                payload: { message: "Low risk of deployment failure based on recent stability." }
            }
        ];

        // Upsert predictions
        // (Skipping actual upsert for read-only demo speed, just returning them for UI)

        return new Response(
            JSON.stringify({ badges: newBadges, predictions }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
