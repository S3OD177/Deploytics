import { createClient } from "@/utils/supabase/server";
import { PricingCards } from "@/components/dashboard/PricingCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, Zap, Calendar } from "lucide-react";

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

    const currentPlan = subscription?.plan || 'free';
    const extraProjects = subscription?.extra_projects || 0;

    // Fetch usage stats
    const { data: projects } = await supabase
        .from('projects')
        .select('id');

    const { data: deploymentsToday } = await supabase
        .from('deployments')
        .select('id')
        .gte('created_at', new Date().toISOString().split('T')[0]);

    const projectCount = projects?.length || 0;
    const deployCount = deploymentsToday?.length || 0;

    // Plan limits
    const planLimits = {
        free: { projects: 3, deploys: 10 },
        pro: { projects: 10, deploys: 100 },
        enterprise: { projects: 25, deploys: Infinity },
    };

    const limits = planLimits[currentPlan as keyof typeof planLimits] || planLimits.free;
    const maxProjects = limits.projects + extraProjects;

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
                <p className="text-muted-foreground">
                    Manage your subscription and view usage.
                </p>
            </div>

            {/* Current Plan Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Current Plan
                        </CardTitle>
                        <CreditCard className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{currentPlan}</div>
                        {extraProjects > 0 && (
                            <p className="text-xs text-muted-foreground">+{extraProjects} extra projects</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Projects Used
                        </CardTitle>
                        <Zap className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {projectCount} / {maxProjects}
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                            <div
                                className="bg-primary h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min((projectCount / maxProjects) * 100, 100)}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Deploys Today
                        </CardTitle>
                        <TrendingUp className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {deployCount} / {limits.deploys === Infinity ? '∞' : limits.deploys}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Billing Cycle
                        </CardTitle>
                        <Calendar className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subscription?.current_period_end
                                ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'N/A'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">Next renewal</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pricing Cards */}
            <div className="pt-4">
                <h3 className="text-xl font-semibold mb-6">Upgrade Your Plan</h3>
                <PricingCards currentPlan={currentPlan} />
            </div>
        </div>
    );
}
