"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Building2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const PLANS = [
    {
        id: "free",
        name: "Free",
        price: 0,
        description: "Perfect for personal projects",
        features: [
            "3 projects",
            "10 deployments/day",
            "1 team member",
            "Manual sync",
            "2 integrations",
            "Basic analytics",
        ],
        icon: Sparkles,
        current: true,
    },
    {
        id: "pro",
        name: "Pro",
        price: 9,
        description: "For growing teams",
        features: [
            "10 projects",
            "100 deployments/day",
            "5 team members",
            "Auto-sync (5 min)",
            "All integrations",
            "Advanced analytics",
            "Email support",
        ],
        icon: Zap,
        popular: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 29,
        description: "For large organizations",
        features: [
            "25 projects",
            "Unlimited deployments",
            "15 team members",
            "Real-time sync",
            "All integrations",
            "Full analytics + Forecasting",
            "Dedicated Slack support",
            "Custom domain",
        ],
        icon: Building2,
    },
];

const ADDONS = [
    { id: "extra_5", name: "+5 Projects", price: 19 },
    { id: "extra_10", name: "+10 Projects", price: 29 },
];

export function PricingCards({ currentPlan = "free" }: { currentPlan?: string }) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (planId: string, type: 'subscription' | 'addon') => {
        setLoading(planId);
        try {
            const res = await fetch('/api/polar/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId, type }),
            });

            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
            } else if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error("Failed to create checkout");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Subscription Plans */}
            <div className="grid gap-6 md:grid-cols-3">
                {PLANS.map((plan) => {
                    const isCurrentPlan = currentPlan === plan.id;
                    const Icon = plan.icon;

                    return (
                        <Card
                            key={plan.id}
                            className={cn(
                                "relative flex flex-col transition-all duration-300 hover:shadow-lg",
                                plan.popular && "ring-2 ring-primary shadow-lg scale-[1.02]"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground px-3">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-2">
                                <div className={cn(
                                    "mx-auto mb-3 p-3 rounded-xl",
                                    plan.popular ? "bg-primary/10" : "bg-muted"
                                )}>
                                    <Icon className={cn(
                                        "size-6",
                                        plan.popular ? "text-primary" : "text-muted-foreground"
                                    )} />
                                </div>
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 pt-0">
                                <div className="text-center mb-6">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>

                                <ul className="space-y-2.5">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <Check className="size-4 text-emerald-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                {isCurrentPlan ? (
                                    <Button className="w-full" variant="secondary" disabled>
                                        Current Plan
                                    </Button>
                                ) : plan.id === 'free' ? (
                                    <Button className="w-full" variant="outline" disabled>
                                        Free Forever
                                    </Button>
                                ) : (
                                    <Button
                                        className={cn(
                                            "w-full",
                                            plan.popular && "bg-primary hover:bg-primary/90"
                                        )}
                                        onClick={() => handleCheckout(plan.id, 'subscription')}
                                        disabled={loading !== null}
                                    >
                                        {loading === plan.id ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            `Upgrade to ${plan.name}`
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Add-ons */}
            <div className="border-t border-border pt-8">
                <h3 className="text-lg font-semibold mb-4">Need more projects?</h3>
                <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                    {ADDONS.map((addon) => (
                        <Card key={addon.id} className="flex items-center justify-between p-4">
                            <div>
                                <p className="font-medium">{addon.name}</p>
                                <p className="text-sm text-muted-foreground">One-time purchase</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold">${addon.price}</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCheckout(addon.id, 'addon')}
                                    disabled={loading !== null}
                                >
                                    {loading === addon.id ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        "Buy"
                                    )}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
