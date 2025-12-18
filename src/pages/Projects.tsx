import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog'
import { EmptyState } from '@/components/dashboard/EmptyState'

export default function Projects() {
    const { user } = useAuth()

    const { data: projects = [], isLoading } = useQuery({
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

    const plan = subscription?.plan || 'free'
    const maxProjects = plan === 'enterprise' ? 25 : plan === 'pro' ? 10 : 3
    const canCreate = projects.length < maxProjects

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your deployment projects ({projects.length}/{maxProjects})
                    </p>
                </div>
                <NewProjectDialog
                    canCreate={canCreate}
                    maxProjects={maxProjects}
                    currentProjects={projects.length}
                />
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
    )
}
