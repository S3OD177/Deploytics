
import { createClient } from "@/utils/supabase/server";
import { ProjectHeader } from "@/components/dashboard/ProjectHeader";
import { ProjectStats } from "@/components/dashboard/ProjectStats";
import { TimelineFeed } from "@/components/dashboard/TimelineFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";

// Note: Using `params: Promise` for Next.js 15
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: project, error } = await supabase
        .from('projects')
        .select(`
        *,
        deployments (
            id,
            status,
            commit_message,
            commit_hash,
            branch,
            created_at,
            duration_seconds
        )
    `)
        .eq('id', id)
        .single();

    if (error || !project) {
        notFound();
    }

    // Calculate Last Deployment stats
    const deployments = project.deployments || [];
    const lastDeployment = deployments.length > 0 ? deployments[0] : null;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="flex flex-col gap-8 pb-20">
                    {/* Header */}
                    <ProjectHeader project={project} />

                    {/* Project Stats */}
                    <ProjectStats lastDeployment={lastDeployment} />

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="timeline" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-transparent p-0 border-b border-border w-full justify-start rounded-none h-auto">
                                <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2 font-medium">Timeline</TabsTrigger>
                                <TabsTrigger value="deployments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2 font-medium">Deployments</TabsTrigger>
                                <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2 font-medium">Logs</TabsTrigger>
                                <TabsTrigger value="env" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2 font-medium">Environment</TabsTrigger>
                                <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2 font-medium">Settings</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="timeline" className="mt-0">
                            <TimelineFeed deployments={deployments} />
                        </TabsContent>

                        <TabsContent value="deployments" className="mt-0">
                            <div className="p-10 text-center text-muted-foreground border border-dashed rounded-xl">
                                Deployments list view coming soon
                            </div>
                        </TabsContent>
                        <TabsContent value="logs" className="mt-0">
                            <div className="p-10 text-center text-muted-foreground border border-dashed rounded-xl">
                                Live Logs view coming soon
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
