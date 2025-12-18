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

    // Fetch Deployments for usage stats
    const { data: deployments = [] } = useQuery({
        queryKey: ['deployments-usage'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deployments')
                .select('created_at, status, duration')
                .eq('status', 'success')
                .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    // Calculate Usage Stats
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const totalDeploysLast24h = deployments.filter((d: any) => new Date(d.created_at) > oneDayAgo).length;

    // Mock build minutes if duration is missing (default 2 mins per build)
    const buildMinutes = deployments.reduce((acc: number, curr: any) => acc + (curr.duration ? Math.ceil(curr.duration / 60) : 2), 0);

    // Mock bandwidth (random for demo or based on deploys)
    const bandwidthGB = parseFloat((deployments.length * 0.5).toFixed(2)); // 0.5 GB per deploy avg

    // Generate Project Signals (mock analysis)
    const projectSignals = projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        activityLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
        impact: Math.random() > 0.7 ? '$2.50' : '$0.00',
        trend: Math.random() > 0.5 ? '+5%' : '0%'
    }));

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
