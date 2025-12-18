import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Plus, FolderKanban, ExternalLink } from 'lucide-react'

export default function Projects() {
    const { user } = useAuth()

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

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
                        Manage your deployment projects
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="bg-card border rounded-xl p-12 text-center">
                    <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first project to start tracking deployments
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                        <Plus className="h-4 w-4" />
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project: any) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="bg-card border rounded-xl p-6 hover:border-primary/50 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FolderKanban className="h-5 w-5 text-primary" />
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-semibold mb-1">{project.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.description || 'No description'}
                            </p>
                            <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{project.platform || 'Vercel'}</span>
                                <span>•</span>
                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
