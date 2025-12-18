import { createClient } from "@/utils/supabase/server";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { NewProjectDialog } from "@/components/dashboard/NewProjectDialog";

const PLAN_LIMITS = {
    free: 3,
    pro: 10,
    enterprise: 25,
};

export default async function OverviewPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan, extra_projects')
        .eq('user_id', user?.id)
        .single();

    const plan = subscription?.plan || 'free';
    const extraProjects = subscription?.extra_projects || 0;
    const maxProjects = (PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 3) + extraProjects;

    // Fetch Projects
    const { data: projectsData } = await supabase
        .from('projects')
        .select(`
      id, 
      name, 
      status, 
      tier,
      created_at,
      deployments (
        id,
        status,
        commit_message,
        commit_hash,
        created_at
      )
    `)
        .order('created_at', { ascending: false });

    // Calculate Stats
    const totalProjects = projectsData?.length || 0;
    const canCreate = totalProjects < maxProjects;

    // Trends using real timestamps
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newProjectsThisWeek = projectsData?.filter((p: any) => new Date(p.created_at) > oneWeekAgo).length || 0;

    // Flatten deployments for stats
    const allDeployments = projectsData?.flatMap((p: any) => p.deployments || []) || [];

    const activeBuilds = allDeployments.filter((d: any) => d.status === 'building').length;
    const failedDeploysTotal = allDeployments.filter((d: any) => d.status === 'failed').length;
    const failedDeploysToday = allDeployments.filter((d: any) => d.status === 'failed' && new Date(d.created_at) > todayStart).length;

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
                <NewProjectDialog
                    canCreate={canCreate}
                    maxProjects={maxProjects}
                    currentProjects={totalProjects}
                />
            </div>

            {/* Stats Row */}
            <OverviewStats
                totalProjects={totalProjects}
                projectTrend={`+${newProjectsThisWeek} this week`}
                projectTrendUp={newProjectsThisWeek > 0}
                activeBuilds={activeBuilds}
                activeBuildsTrend={activeBuilds > 0 ? `${activeBuilds} running` : "No active builds"}
                failedDeploys={failedDeploysTotal}
                failedDeploysTrend={`+${failedDeploysToday} today`}
                failedDeploysTrendUp={failedDeploysToday === 0} // Good if 0
            />

            {/* Projects Grid */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    Your Projects
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {totalProjects} / {maxProjects}
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
