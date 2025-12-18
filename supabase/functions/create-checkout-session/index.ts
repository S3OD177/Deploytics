
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
        // 1. Authenticate user
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

        // 2. Get Request Body
        const { plan, type } = await req.json()

        // 3. Map Plan to Polar Product Price ID
        let priceId = '';
        const polarAccessToken = Deno.env.get('POLAR_ACCESS_TOKEN');

        if (!polarAccessToken) {
            throw new Error('Polar config missing (POLAR_ACCESS_TOKEN)');
        }

        // Map your internal plan IDs to Polar Product Price IDs (configured in Env Vars)
        if (type === 'subscription') {
            if (plan === 'pro') priceId = Deno.env.get('POLAR_PRICE_PRO_ID') ?? '';
            if (plan === 'enterprise') priceId = Deno.env.get('POLAR_PRICE_ENTERPRISE_ID') ?? '';
        } else if (type === 'addon') {
            if (plan === 'extra_5') priceId = Deno.env.get('POLAR_PRICE_PROJECTS_5_ID') ?? '';
        }

        if (!priceId) {
            throw new Error('Invalid plan or missing price configuration');
        }

        // 4. Create Checkout Session via Polar API
        const response = await fetch('https://api.polar.sh/v1/checkouts/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${polarAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_price_id: priceId,
                success_url: `${req.headers.get('origin')}/dashboard?checkout=success`,
                customer_email: user.email,
                metadata: {
                    user_id: user.id,
                    plan_type: type,
                    plan_id: plan
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Polar API Error:', data);
            throw new Error(data.detail || 'Failed to create checkout session');
        }

        return new Response(
            JSON.stringify({ url: data.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
