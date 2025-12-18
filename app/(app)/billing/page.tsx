
import { createClient } from "@/utils/supabase/server";
import { BillingOverview } from "@/components/dashboard/BillingOverview";
import { createClient as createAdminClient } from '@supabase/supabase-js'

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Projects with aggregate usage data
    const { data: projects } = await supabase
        .from('projects')
        .select(`
        id,
        name,
        deployments (
            id,
            status,
            created_at,
            duration_seconds
        ),
        usage_metrics (
            metric_name,
            value,
            recorded_at
        )
    `);

    // Flatten/Calculate usage
    const projectsData = projects || [];

    // Calculate Global Totals
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Build Minutes (from deployments duration)
    const buildSeconds = projectsData.reduce((acc, p) => {
        const pDeploys = p.deployments || [];
        const monthDeploys = pDeploys.filter((d: any) => new Date(d.created_at) >= currentMonthStart);
        return acc + monthDeploys.reduce((sum: number, d: any) => sum + (d.duration_seconds || 0), 0);
    }, 0);
    const buildMinutes = Math.ceil(buildSeconds / 60);

    // Bandwidth (from usage_metrics)
    const bandwidthGB = projectsData.reduce((acc, p) => {
        const pUsage = p.usage_metrics || [];
        const monthUsage = pUsage.filter((u: any) => u.metric_name === 'bandwidth_gb' && new Date(u.recorded_at) >= currentMonthStart);
        return acc + monthUsage.reduce((sum: number, u: any) => sum + Number(u.value), 0);
    }, 0);

    // Calculate generic Usage Signals
    const totalDeploysLast24h = projectsData.reduce((acc, p) => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return acc + (p.deployments?.filter((d: any) => new Date(d.created_at) >= oneDayAgo).length || 0);
    }, 0);

    // Project-level signals
    const projectSignals = projectsData.map(p => {
        const pDeploys = p.deployments || [];
        const lastMonthDeploys = pDeploys.filter((d: any) => new Date(d.created_at) >= currentMonthStart).length;

        return {
            id: p.id,
            name: p.name,
            activityLevel: lastMonthDeploys > 20 ? 'High' : lastMonthDeploys > 5 ? 'Med' : 'Low',
            impact: lastMonthDeploys > 20 ? 'High Compute' : 'Stable',
            trend: 'Stable' // Mock trend for now
        };
    });

    return (
        <div className="pb-20">
            <BillingOverview
                buildMinutes={buildMinutes}
                bandwidthGB={bandwidthGB}
                totalDeploysLast24h={totalDeploysLast24h}
                projectSignals={projectSignals}
            />
        </div>
    );
}
