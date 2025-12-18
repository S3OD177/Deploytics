import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProjectDetail() {
    const { id } = useParams()

    const { data: project, isLoading: projectLoading } = useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single()
            if (error) throw error
            return data
        },
    })

    const { data: deployments = [] } = useQuery({
        queryKey: ['deployments', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deployments')
                .select('*')
                .eq('project_id', id)
                .order('created_at', { ascending: false })
            if (error) throw error
            return data
        },
    })

    if (projectLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Project not found</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    to="/projects"
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <p className="text-muted-foreground mt-1">
                        {project.description || 'No description'}
                    </p>
                </div>
            </div>

            {/* Deployments */}
            <div className="bg-card border rounded-xl">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Deployments</h2>
                </div>
                <div className="divide-y">
                    {deployments.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            No deployments yet
                        </div>
                    ) : (
                        deployments.map((deployment: any) => (
                            <div key={deployment.id} className="p-4 flex items-center gap-4">
                                <div className={`p-2 rounded-full ${deployment.status === 'success'
                                        ? 'bg-green-500/10'
                                        : deployment.status === 'failed'
                                            ? 'bg-red-500/10'
                                            : 'bg-yellow-500/10'
                                    }`}>
                                    {deployment.status === 'success' ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : deployment.status === 'failed' ? (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{deployment.commit_message || 'Deployment'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {deployment.branch} • {deployment.commit_hash?.substring(0, 7)}
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(deployment.created_at).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
