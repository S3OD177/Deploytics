import { createClient } from "@/utils/supabase/server";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
    const supabase = await createClient();

    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
            id, 
            name, 
            status, 
            tier,
            deployments (
                id,
                status,
                commit_message,
                commit_hash,
                created_at
            )
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor your deployed projects.</p>
                </div>
                <Button className="font-medium shadow-none">
                    <Plus className="mr-2 size-4" />
                    New Project
                </Button>
            </div>

            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-border/50 text-center">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <Plus className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Get started by creating your first project to deploy your application.
                    </p>
                    <Button> Create Project </Button>
                </div>
            )}
        </div>
    );
}
