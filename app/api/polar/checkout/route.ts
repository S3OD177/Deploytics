import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const PLAN_LIMITS = {
    free: 3,
    pro: 10,
    enterprise: 25
};

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan, type } = await request.json();

        // Get Polar access token from env
        const polarToken = process.env.POLAR_ACCESS_TOKEN;
        if (!polarToken) {
            return NextResponse.json({ error: "Polar not configured" }, { status: 500 });
        }

        // Determine the product based on type
        let productId: string;
        let successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`;
        let cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`;

        if (type === 'subscription') {
            // Map plan to Polar product ID (you'll set these in env)
            switch (plan) {
                case 'pro':
                    productId = process.env.POLAR_PRO_PRODUCT_ID || '';
                    break;
                case 'enterprise':
                    productId = process.env.POLAR_ENTERPRISE_PRODUCT_ID || '';
                    break;
                default:
                    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
            }
        } else if (type === 'addon') {
            // One-time purchase add-on
            if (plan === 'extra_5') {
                productId = process.env.POLAR_ADDON_5_PRODUCT_ID || '';
            } else {
                return NextResponse.json({ error: "Invalid addon" }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        if (!productId) {
            return NextResponse.json({ error: "Product not configured" }, { status: 500 });
        }

        // Create Polar checkout session
        const response = await fetch('https://api.polar.sh/v1/checkouts/custom', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${polarToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                success_url: successUrl,
                customer_email: user.email,
                metadata: {
                    user_id: user.id,
                    plan: plan,
                    type: type
                }
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Polar error:', error);
            return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
        }

        const checkout = await response.json();

        return NextResponse.json({ url: checkout.url });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
