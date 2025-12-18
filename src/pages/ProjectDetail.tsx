
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, XCircle, Clock, LayoutGrid, Users, Settings } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamManager } from "@/components/dashboard/TeamManager"

export default function ProjectDetail() {
    const { id } = useParams()

    const { data: project, isLoading: projectLoading } = useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            // Basic fetch
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
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/projects" className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <p className="text-muted-foreground mt-1">{project.description || 'No description'}</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview" className="gap-2"><LayoutGrid className="size-4" /> Overview</TabsTrigger>
                    <TabsTrigger value="deployments" className="gap-2"><Clock className="size-4" /> Deployments</TabsTrigger>
                    <TabsTrigger value="team" className="gap-2"><Users className="size-4" /> Team</TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2"><Settings className="size-4" /> Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="p-6 border rounded-xl bg-card text-center text-muted-foreground">
                        Chart Overview Component would go here (reusing Dashboard charts tailored to this project)
                    </div>
                </TabsContent>

                <TabsContent value="deployments">
                    <div className="bg-card border rounded-xl overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold">Deployments History</h2>
                        </div>
                        <div className="divide-y max-h-[600px] overflow-y-auto">
                            {deployments.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">No deployments yet</div>
                            ) : (
                                deployments.map((deployment: any) => (
                                    <div key={deployment.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
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
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="font-mono bg-muted px-1.5 rounded text-[10px]">{deployment.commit_hash?.substring(0, 7) || 'HEAD'}</span>
                                                <span>•</span>
                                                <span>{deployment.branch || 'main'}</span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(deployment.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="team">
                    <div className="bg-card border rounded-xl p-6">
                        <TeamManager projectId={id!} />
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <div className="bg-card border rounded-xl p-6 text-center text-muted-foreground">
                        Project Settings (Name, Environment Variables, Deletion)
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
