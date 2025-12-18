import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import crypto from "crypto";

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const bodyText = await request.text();
        const signature = request.headers.get("webhook-signature");
        const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

        // Verify signature if secret is configured
        if (webhookSecret && signature) {
            const computedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(bodyText)
                .digest("hex");

            if (computedSignature !== signature) {
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        }

        const event = JSON.parse(bodyText);
        const supabase = createAdminClient();

        switch (event.type) {
            case "checkout.completed": {
                const { metadata, customer } = event.data;
                const userId = metadata?.user_id;
                const plan = metadata?.plan;
                const type = metadata?.type;

                if (!userId) break;

                if (type === "subscription") {
                    // Upsert subscription
                    await supabase.from("subscriptions").upsert({
                        user_id: userId,
                        plan: plan,
                        status: "active",
                        polar_subscription_id: event.data.subscription_id,
                        polar_customer_id: customer?.id,
                        current_period_end: event.data.current_period_end,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: "user_id" });
                } else if (type === "addon") {
                    // Add extra projects (+5 for $4.99)
                    const extraProjects = plan === "extra_5" ? 5 : 0;

                    // Record purchase
                    await supabase.from("purchases").insert({
                        user_id: userId,
                        product_type: plan,
                        polar_checkout_id: event.data.id,
                        amount_cents: event.data.amount,
                    });

                    // Update subscription extra_projects
                    const { data: sub } = await supabase
                        .from("subscriptions")
                        .select("extra_projects")
                        .eq("user_id", userId)
                        .single();

                    const currentExtra = sub?.extra_projects || 0;
                    await supabase
                        .from("subscriptions")
                        .upsert({
                            user_id: userId,
                            extra_projects: currentExtra + extraProjects,
                            updated_at: new Date().toISOString(),
                        }, { onConflict: "user_id" });
                }
                break;
            }

            case "subscription.canceled": {
                const { metadata } = event.data;
                const userId = metadata?.user_id;

                if (userId) {
                    await supabase
                        .from("subscriptions")
                        .update({ status: "canceled", plan: "free" })
                        .eq("user_id", userId);
                }
                break;
            }

            case "subscription.updated": {
                const { metadata } = event.data;
                const userId = metadata?.user_id;

                if (userId) {
                    await supabase
                        .from("subscriptions")
                        .update({
                            current_period_end: event.data.current_period_end,
                            status: event.data.status,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("user_id", userId);
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Polar webhook error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
