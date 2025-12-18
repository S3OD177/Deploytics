
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { DoraMetricsCards } from '@/components/analytics/DoraMetricsCards'
import { DeploymentFrequencyChart } from '@/components/analytics/DeploymentFrequencyChart'
import { AiInsights } from '@/components/analytics/AiInsights'
import { TimelineFeed } from '@/components/dashboard/TimelineFeed'
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { format, subDays, startOfDay, isSameDay } from 'date-fns'
import { Activity, ShieldCheck, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

    // 1. Deployment Frequency (Calculate actual days spanned by deployment data)
    const dates = deployments.map((d: any) => new Date(d.created_at).getTime());
    const oldestDate = dates.length > 0 ? Math.min(...dates) : Date.now();
    const daySpan = Math.max(1, Math.ceil((Date.now() - oldestDate) / (1000 * 60 * 60 * 24)));
    const frequencyValue = totalDeps > 0 ? (totalDeps / daySpan).toFixed(1) : "0";
    const freqRating = parseFloat(frequencyValue) >= 1 ? 'Elite' : parseFloat(frequencyValue) >= 0.14 ? 'High' : 'Low';

    // 2. Change Failure Rate (CFR)
    const failureRate = totalDeps > 0 ? ((failedDeps / totalDeps) * 100).toFixed(1) + "%" : "0%";
    const cfrRating = failedDeps === 0 ? 'Elite' : (failedDeps / totalDeps) < 0.15 ? 'High' : 'Low';

    // 3. Avg Build Time (proxy for Lead Time - true Lead Time requires commit timestamps from GitHub)
    const avgDuration = totalDeps > 0
        ? Math.round(deployments.reduce((acc: number, d: any) => acc + (d.duration_seconds || 0), 0) / totalDeps)
        : 0;

    // 4. MTTR - Requires incident tracking (not yet implemented)
    const mttrValue = "—"; // Placeholder until incident data is available

    const doraMetrics = {
        deploymentFrequency: { value: `${frequencyValue}/day`, label: `Over ${daySpan} days`, rating: freqRating as any },
        leadTime: { value: avgDuration > 0 ? `${avgDuration}s` : '—', label: "Avg Build Time", rating: avgDuration > 0 && avgDuration < 120 ? 'Elite' : avgDuration > 0 ? 'High' : 'Medium' as any },
        changeFailureRate: { value: failureRate, label: `${totalDeps} deploys`, rating: cfrRating as any },
        mttr: { value: mttrValue, label: "Coming Soon", rating: 'Medium' as any }
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
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <Badge variant="outline" className="h-6 gap-1.5 border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-medium">
                            <ShieldCheck className="size-3.5" />
                            System Healthy
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        Deployment health and DORA metrics.
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Live Updates Enabled
                        </span>
                    </p>
                </div>
                <NewProjectDialog
                    canCreate={canCreate}
                    maxProjects={maxProjects}
                    currentProjects={projects.length}
                    defaultTier={subscription?.plan}
                />
            </div>

            {/* DORA Metrics */}
            <DoraMetricsCards metrics={doraMetrics} />

            {/* AI Insights & Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                    <AiInsights metrics={doraMetrics} />
                </div>
                <div className="md:col-span-1 bg-card border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Project Capacity</span>
                        <span className="text-lg font-bold">{projects.length} / {maxProjects}</span>
                    </div>
                    <div className="size-10 rounded-full border-4 border-muted flex items-center justify-center relative">
                        <svg className="size-10 rotate-[-90deg]">
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-primary"
                                strokeDasharray={100}
                                strokeDashoffset={100 - (projects.length / maxProjects) * 100}
                            />
                        </svg>
                    </div>
                </div>
            </div>

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
