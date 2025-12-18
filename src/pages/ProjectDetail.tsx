
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, XCircle, Clock, LayoutGrid, Users, Settings, Activity, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamManager } from "@/components/dashboard/TeamManager"
import { ProjectSettings } from "@/components/dashboard/ProjectSettings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ProjectDetail() {
    const { id } = useParams()
    const queryClient = useQueryClient()

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

    // Mutations
    const fetchMutation = useMutation({
        mutationFn: async () => {
            // Mocking a fetch delay for now
            await new Promise(resolve => setTimeout(resolve, 1500));
            // In real app, this would trigger an edge function to pull from provider
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deployments', id] });
            toast.success("Project data refreshed");
        },
        onError: () => {
            toast.error("Failed to refresh project data");
        }
    });

    const resolveMutation = useMutation({
        mutationFn: async (deploymentId: string) => {
            const { error } = await supabase
                .from('deployments')
                .update({
                    status: 'success', // or just add resolved_at if we want to keep 'failed' status
                    resolved_at: new Date().toISOString()
                })
                .eq('id', deploymentId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deployments', id] });
            toast.success("Incident marked as resolved");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to resolve incident");
        }
    });

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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/projects" className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                    <p className="text-muted-foreground mt-1">{project.description || 'No description'}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 font-bold"
                        onClick={() => fetchMutation.mutate()}
                        disabled={fetchMutation.isPending}
                    >
                        <RefreshCw className={cn("size-4", fetchMutation.isPending && "animate-spin")} />
                        {fetchMutation.isPending ? "Fetching..." : "Fetch Now"}
                    </Button>
                    <Button variant="secondary" size="sm" className="gap-2 font-bold" asChild>
                        <a href={`/status/${id}`} target="_blank" rel="noreferrer">
                            <Activity className="size-4" />
                            Public Status Page
                        </a>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="overview" className="gap-2"><LayoutGrid className="size-4" /> Overview</TabsTrigger>
                    <TabsTrigger value="deployments" className="gap-2"><Clock className="size-4" /> Deployments</TabsTrigger>
                    <TabsTrigger value="team" className="gap-2"><Users className="size-4" /> Team</TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2"><Settings className="size-4" /> Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="p-12 border-2 border-dashed rounded-xl bg-card/30 text-center text-muted-foreground flex flex-col items-center gap-3">
                        <LayoutGrid className="size-10 opacity-20" />
                        <div>
                            <p className="font-medium text-foreground">Project Analytics Overview</p>
                            <p className="text-sm">Detailed charts and resource usage metrics coming soon.</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="deployments">
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Deployments History</h2>
                            <Badge variant="outline" className="font-mono text-[10px]">{deployments.length} total</Badge>
                        </div>
                        <div className="divide-y max-h-[600px] overflow-y-auto">
                            {deployments.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                                    <Clock className="size-8 opacity-20" />
                                    <p>No deployments recorded yet</p>
                                </div>
                            ) : (
                                deployments.map((deployment: any) => (
                                    <div key={deployment.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                                        <div className={cn(
                                            "p-2.5 rounded-xl ring-1 ring-inset",
                                            deployment.status === 'success'
                                                ? 'bg-emerald-500/10 ring-emerald-500/20 text-emerald-500'
                                                : deployment.status === 'failed'
                                                    ? 'bg-red-500/10 ring-red-500/20 text-red-500'
                                                    : 'bg-amber-500/10 ring-amber-500/20 text-amber-500'
                                        )}>
                                            {deployment.status === 'success' ? (
                                                <CheckCircle className="h-4.5 w-4.5" />
                                            ) : deployment.status === 'failed' ? (
                                                <XCircle className="h-4.5 w-4.5" />
                                            ) : (
                                                <Clock className="h-4.5 w-4.5" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold truncate">{deployment.commit_message || 'Deployment'}</p>
                                                {deployment.resolved_at && (
                                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-[9px] uppercase font-bold px-1.5 h-4">Resolved</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <span className="font-mono bg-muted/50 px-1.5 rounded text-[10px] ring-1 ring-inset ring-border/50">{deployment.commit_hash?.substring(0, 7) || 'HEAD'}</span>
                                                <span>•</span>
                                                <span className="capitalize">{deployment.branch || 'main'}</span>
                                            </div>
                                        </div>
                                        {deployment.status === 'failed' && !deployment.resolved_at && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3 font-bold text-xs"
                                                onClick={() => resolveMutation.mutate(deployment.id)}
                                                disabled={resolveMutation.isPending}
                                            >
                                                Mark as Resolved
                                            </Button>
                                        )}
                                        <div className="text-[11px] font-medium text-muted-foreground text-right">
                                            <p>{new Date(deployment.created_at).toLocaleDateString()}</p>
                                            <p className="opacity-70">{new Date(deployment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="team">
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <TeamManager projectId={id!} />
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <ProjectSettings project={project} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
