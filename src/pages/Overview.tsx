import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { OverviewStats } from '@/components/dashboard/OverviewStats'
import { DeploymentChart } from '@/components/dashboard/DeploymentChart'
import { TimelineFeed } from '@/components/dashboard/TimelineFeed'
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Overview() {
    const { user } = useAuth()

    // Fetch projects with deployments
    const { data: projects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    deployments (
                        id,
                        status,
                        commit_message,
                        commit_hash,
                        created_at
                    )
                `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    // Fetch subscription for project limits
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

    // Fetch all deployments for charts
    const { data: deployments = [] } = useQuery({
        queryKey: ['all-deployments'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deployments')
                .select('*, projects(name)')
                .order('created_at', { ascending: false })
                .limit(50)
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    const plan = subscription?.plan || 'free'
    const maxProjects = plan === 'enterprise' ? 25 : plan === 'pro' ? 10 : 3
    const canCreate = projects.length < maxProjects

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
                        Welcome back! Here's your deployment overview.
                    </p>
                </div>
                <NewProjectDialog
                    canCreate={canCreate}
                    maxProjects={maxProjects}
                    currentProjects={projects.length}
                />
            </div>

            {/* Stats */}
            <OverviewStats projects={projects} deployments={deployments} />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DeploymentChart deployments={deployments} />
                <TimelineFeed deployments={deployments} />
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
