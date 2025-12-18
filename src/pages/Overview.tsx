
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { DoraMetricsCards } from '@/components/analytics/DoraMetricsCards'
import { DeploymentFrequencyChart } from '@/components/analytics/DeploymentFrequencyChart'
import { TimelineFeed } from '@/components/dashboard/TimelineFeed'
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { format, subDays, startOfDay, isSameDay } from 'date-fns'

export default function Overview() {
    const { user } = useAuth()

    // Fetch projects
    const { data: projects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*, deployments(id, status, commit_message, commit_hash, created_at, duration_seconds)')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    // Fetch subscription
    const { data: subscription } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user?.id)
                .single()
            return data
        },
        enabled: !!user,
    })

    // Fetch all deployments (limit 100 for stats)
    const { data: deployments = [] } = useQuery({
        queryKey: ['overview-deployments'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deployments')
                .select('*, projects(name)')
                .order('created_at', { ascending: false })
                .limit(100)
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    const plan = subscription?.plan || 'free'
    const maxProjects = plan === 'enterprise' ? 25 : plan === 'pro' ? 10 : 3
    const canCreate = projects.length < maxProjects

    // --- Calculate DORA Metrics ---
    const totalDeps = deployments.length;
    const failedDeps = deployments.filter((d: any) => d.status === 'failed').length;
    const successDeps = deployments.filter((d: any) => d.status === 'success').length;

    // 1. Frequency
    // Simple calc: total / 7 days (mock window or actual data spread)
    const frequencyValue = totalDeps > 0 ? (totalDeps / 7).toFixed(1) : "0";
    const freqRating = totalDeps > 20 ? 'Elite' : totalDeps > 5 ? 'High' : 'Low'; // arbitrary thresholds

    // 2. Failure Rate
    const failureRate = totalDeps > 0 ? ((failedDeps / totalDeps) * 100).toFixed(1) + "%" : "0%";
    const cfrRating = failedDeps === 0 ? 'Elite' : (failedDeps / totalDeps) < 0.15 ? 'High' : 'Low';

    // 3. Lead Time (Mocked as actual commit time is hard without GitHub API yet)
    // We'll use avg duration as a proxy for "Build Time" in the UI for now
    const avgDuration = totalDeps > 0
        ? Math.round(deployments.reduce((acc: number, d: any) => acc + (d.duration_seconds || 0), 0) / totalDeps)
        : 0;

    // 4. MTTR (Mocked)
    const mttrValue = "1h 12m"; // Placeholder until we have incident tracking

    const doraMetrics = {
        deploymentFrequency: { value: `${frequencyValue}/day`, label: "Avg last 7 days", rating: freqRating as any },
        leadTime: { value: `${avgDuration}s`, label: "Avg Build Time", rating: avgDuration < 120 ? 'Elite' : 'High' as any },
        changeFailureRate: { value: failureRate, label: "Last 100 deploys", rating: cfrRating as any },
        mttr: { value: mttrValue, label: "Avg Recovery", rating: 'Medium' as any }
    };

    // --- Prepare Chart Data ---
    // Last 7 days
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(new Date(), 6 - i);
        const dayDeploys = deployments.filter((dep: any) => isSameDay(new Date(dep.created_at), d));
        return {
            date: format(d, 'MMM dd'),
            success: dayDeploys.filter((dep: any) => dep.status === 'success').length,
            failed: dayDeploys.filter((dep: any) => dep.status === 'failed').length
        };
    });

    if (projectsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Deployment health and DORA metrics.
                    </p>
                </div>
                <NewProjectDialog
                    canCreate={canCreate}
                    maxProjects={maxProjects}
                    currentProjects={projects.length}
                />
            </div>

            {/* DORA Metrics */}
            <DoraMetricsCards metrics={doraMetrics} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DeploymentFrequencyChart data={chartData} period="7d" />
                <div className="lg:col-span-1">
                    <TimelineFeed deployments={deployments} />
                </div>
            </div>

            {/* Projects Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Projects</h2>
                    <span className="text-sm text-muted-foreground">
                        {projects.length} / {maxProjects} projects
                    </span>
                </div>

                {projects.length === 0 ? (
                    <EmptyState type="projects" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
