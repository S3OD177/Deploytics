
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, LayoutGrid, Users, Settings, Activity, RefreshCw, Clock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamManager } from "@/components/dashboard/TeamManager"
import { ProjectSettings } from "@/components/dashboard/ProjectSettings"
import { DeploymentList } from "@/components/dashboard/DeploymentList"
import { SuccessRateChart } from "@/components/dashboard/SuccessRateChart"
import { Button } from "@/components/ui/button"
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <SuccessRateChart deployments={deployments} />
                        <div className="p-6 border rounded-xl bg-card text-muted-foreground flex flex-col items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-foreground">$0.00</span>
                            <span className="text-xs uppercase font-bold tracking-wider">Est. Cost (MD)</span>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="deployments">
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-0 md:p-0 border-0 bg-transparent shadow-none">
                        <DeploymentList
                            deployments={deployments}
                            projectId={id!}
                            onResolve={(id) => resolveMutation.mutate(id)}
                            isResolving={resolveMutation.isPending}
                        />
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
