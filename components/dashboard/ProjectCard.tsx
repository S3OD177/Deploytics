
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Activity, GitCommit, ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to get status color
const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
        case 'archived': return 'bg-slate-500/15 text-slate-500 border-slate-500/20';
        default: return 'bg-blue-500/15 text-blue-500 border-blue-500/20';
    }
};

const getDeployStatusColor = (status: string) => {
    switch (status) {
        case 'success': return 'bg-emerald-500/20 text-emerald-400';
        case 'failed': return 'bg-rose-500/20 text-rose-400';
        case 'building': return 'bg-yellow-500/20 text-yellow-400 animate-pulse';
        case 'queued': return 'bg-slate-500/20 text-slate-400';
        default: return 'bg-slate-500/20 text-slate-400';
    }
}


export function ProjectCard({ project }: { project: any }) {
    // Get latest deployment
    const latestDeploy = project.deployments && project.deployments.length > 0
        ? project.deployments[0]
        : null;

    return (
        <div className="group relative bg-card hover:bg-muted/30 border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex flex-col h-[220px]">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("size-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/20 to-indigo-500/20 text-primary")}>
                        <Activity className="size-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
                            {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", getStatusColor(project.status))}>
                                {project.status}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">• {project.tier}</span>
                        </div>
                    </div>
                </div>
                <Link href={`/projects/${project.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-foreground">
                    <ArrowUpRight className="size-4" />
                </Link>
            </div>

            {/* Latest Commit / Activity */}
            <div className="flex-1">
                {latestDeploy ? (
                    <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                            <div className={cn("mt-0.5 size-2 rounded-full shrink-0", getDeployStatusColor(latestDeploy.status).split(' ')[0].replace('/20', ''))}></div>
                            <div>
                                <p className="text-sm font-medium text-foreground line-clamp-1">
                                    {latestDeploy.commit_message || "No message"}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <GitCommit className="size-3" />
                                    <span className="font-mono">{latestDeploy.commit_hash?.substring(0, 7)}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(latestDeploy.created_at), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic border border-dashed border-border/50 rounded-lg bg-muted/10">
                        No recent activity
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
                    <Activity className="size-3" />
                    <span>98% Health</span> {/* Mock health for now */}
                </div>
                {latestDeploy && (
                    <Badge variant="secondary" className={cn("capitalize font-normal text-xs", getDeployStatusColor(latestDeploy.status))}>
                        {latestDeploy.status}
                    </Badge>
                )}
            </div>
        </div>
    );
}
