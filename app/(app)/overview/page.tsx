
import { createClient } from "@/utils/supabase/server";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function OverviewPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Projects
    const { data: projectsData, error: projError } = await supabase
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

    // Calculate Stats (Basic)
    const totalProjects = projectsData?.length || 0;
    const activeBuilds = projectsData?.reduce((acc, p) =>
        acc + (p.deployments?.filter((d: any) => d.status === 'building').length || 0), 0) || 0;
    const failedDeploys = projectsData?.reduce((acc, p) =>
        acc + (p.deployments?.filter((d: any) => d.status === 'failed').length || 0), 0) || 0;

    return (
        <div className="flex flex-col gap-8 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Welcome back, <span className="text-foreground font-medium">{user?.email?.split('@')[0] || 'User'}</span>
                    </p>
                </div>
                <Button className="font-medium shadow-none">
                    <Plus className="mr-2 size-4" />
                    New Project
                </Button>
            </div>

            {/* Stats Row */}
            <OverviewStats
                totalProjects={totalProjects}
                activeBuilds={activeBuilds}
                failedDeploys={failedDeploys}
            />

            {/* Projects Grid */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    Your Projects
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {totalProjects}
                    </span>
                </h3>
                {projectsData && projectsData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projectsData.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-muted">
                        <p className="text-muted-foreground">No projects found. Create one or connect an integration.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
