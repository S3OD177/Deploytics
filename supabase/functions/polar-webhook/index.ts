
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    try {
        const body = await req.json();
        const { type, data } = body;

        console.log(`Received Polar Webhook: ${type}`, data);

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        if (type === 'subscription.created' || type === 'subscription.updated') {
            const subscription = data;
            const metadata = subscription.metadata || {};
            const userId = metadata.user_id;

            if (!userId) {
                console.warn('Subscription event missing user_id in metadata');
                return new Response(JSON.stringify({ message: 'Missing user_id' }), { status: 200 });
            }

            // Map Polar plan price ID to our internal plan name
            let planName = 'free';
            const priceId = subscription.price_id;

            if (priceId === Deno.env.get('POLAR_PRICE_PRO_ID')) planName = 'pro';
            else if (priceId === Deno.env.get('POLAR_PRICE_ENTERPRISE_ID')) planName = 'enterprise';

            const { error } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    plan: planName,
                    status: subscription.status === 'active' ? 'active' : 'canceled',
                    polar_subscription_id: subscription.id,
                    polar_customer_id: subscription.customer_id,
                    current_period_end: subscription.current_period_end,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (error) throw error;
        }

        if (type === 'order.created') {
            const order = data;
            const metadata = order.metadata || {};
            const userId = metadata.user_id;

            if (!userId) {
                console.warn('Order event missing user_id in metadata');
                return new Response(JSON.stringify({ message: 'Missing user_id' }), { status: 200 });
            }

            // Handle one-time add-ons
            const productPriceId = order.product_price_id;

            if (productPriceId === Deno.env.get('POLAR_PRICE_PROJECTS_5_ID')) {
                // Increment extra_projects in subscriptions table
                const { data: subData, error: fetchError } = await supabaseAdmin
                    .from('subscriptions')
                    .select('extra_projects')
                    .eq('user_id', userId)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

                const currentExtra = subData?.extra_projects || 0;

                const { error: updateError } = await supabaseAdmin
                    .from('subscriptions')
                    .upsert({
                        user_id: userId,
                        extra_projects: currentExtra + 5,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });

                if (updateError) throw updateError;

                // Log purchase
                await supabaseAdmin.from('purchases').insert({
                    user_id: userId,
                    product_type: 'extra_projects_5',
                    polar_checkout_id: order.id,
                    amount_cents: order.amount
                });
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Webhook Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
});
