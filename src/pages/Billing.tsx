import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { BillingOverview } from '@/components/dashboard/BillingOverview'
import { PricingCards } from '@/components/dashboard/PricingCards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Billing() {
    const { user } = useAuth()

    // Fetch subscription
    const { data: subscription } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user?.id)
                .single()
            if (error && error.code !== 'PGRST116') throw error
            return data
        },
        enabled: !!user,
    })

    // Fetch projects
    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('id, name')
                .eq('user_id', user?.id)
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    // Fetch Deployments for usage stats (Last 30 days)
    const { data: deployments = [] } = useQuery({
        queryKey: ['deployments-usage'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deployments')
                .select('project_id, created_at, status, duration')
                .eq('status', 'success')
                .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    // Calculate Usage Stats (Real Data Only)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const totalDeploysLast24h = deployments.filter((d: any) => new Date(d.created_at) > oneDayAgo).length;

    // Calculate real build minutes (defaults to 0 if duration is missing)
    const buildMinutes = deployments.reduce((acc: number, curr: any) => acc + (curr.duration ? Math.ceil(curr.duration / 60) : 0), 0);

    // Bandwidth is not currently tracked, set to 0.0 to indicate no data
    const bandwidthGB = 0.0;

    // Generate Project Signals based on REAL deployment data
    const projectSignals = projects.map((p: any) => {
        const projectDeploys = deployments.filter((d: any) => d.project_id === p.id);
        const deployCount = projectDeploys.length;

        let activityLevel = 'Low';
        if (deployCount > 20) activityLevel = 'High';
        else if (deployCount > 5) activityLevel = 'Medium';

        // Calculate impact based on build minutes (e.g. $0.05/min)
        const projectMinutes = projectDeploys.reduce((acc: number, curr: any) => acc + (curr.duration ? Math.ceil(curr.duration / 60) : 0), 0);
        const estCost = projectMinutes * 0.05; // $0.05 per minute assumption from BillingOverview

        // Trend calculation needs more data, we'll leave it as "Stable" or derived if possible
        // For now, "Stable" is a safe neutral derived value, not random.
        const trend = 'Stable';

        return {
            id: p.id,
            name: p.name,
            activityLevel,
            impact: `$${estCost.toFixed(2)}`,
            trend
        };
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Billing</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your subscription, costs, and plans.
                </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview & Usage</TabsTrigger>
                    <TabsTrigger value="plans">Plans & Subscription</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <BillingOverview
                        buildMinutes={buildMinutes}
                        bandwidthGB={bandwidthGB}
                        totalDeploysLast24h={totalDeploysLast24h}
                        projectSignals={projectSignals}
                    />
                </TabsContent>

                <TabsContent value="plans">
                    <PricingCards currentPlan={subscription?.plan || 'free'} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
