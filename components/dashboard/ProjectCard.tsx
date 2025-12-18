
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Activity, GitCommit, ArrowUpRight, Github, Clock, CheckCircle2, XCircle, Layout } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

// Helper to get status color
const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'active': return 'default'; // Uses primary color usually
        case 'archived': return 'secondary';
        default: return 'outline';
    }
};

const getDeployStatusColor = (status: string) => {
    switch (status) {
        case 'success': return 'text-emerald-500';
        case 'failed': return 'text-red-500';
        case 'building': return 'text-amber-500 animate-pulse';
        case 'queued': return 'text-blue-500';
        default: return 'text-muted-foreground';
    }
};

const getDeployIcon = (status: string) => {
    switch (status) {
        case 'success': return CheckCircle2;
        case 'failed': return XCircle;
        case 'building': return Activity;
        case 'queued': return Clock;
        default: return GitCommit;
    }
}


export function ProjectCard({ project }: { project: any }) {
    // Get latest deployment
    const latestDeploy = project.deployments && project.deployments.length > 0
        ? project.deployments[0]
        : null;

    const DeployIcon = latestDeploy ? getDeployIcon(latestDeploy.status) : GitCommit;

    return (
        <Card className="group relative overflow-hidden bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-[240px]">
            {/* Gradient Accent on active cards */}
            {project.status === 'active' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className={cn("size-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300")}>
                            <Layout className="size-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer">
                                {project.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 font-mono uppercase tracking-wider">
                                    {project.tier}
                                </Badge>
                                <span className="text-xs text-muted-foreground">• {project.status}</span>
                            </div>
                        </div>
                    </div>
                    <Link href={`/projects/${project.id}`}>
                        <div className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            <ArrowUpRight className="size-4" />
                        </div>
                    </Link>
                </div>
            </CardHeader>

            {/* Latest Activity */}
            <div className="flex-1 p-5 pt-2">
                <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border/50 group-hover:border-primary/10 transition-colors">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
                        latest activity
                    </p>
                    {latestDeploy ? (
                        <div className="flex items-start gap-3">
                            <DeployIcon className={cn("mt-0.5 size-4", getDeployStatusColor(latestDeploy.status))} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {latestDeploy.commit_message || "No message"}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono">
                                    <span>{latestDeploy.commit_hash?.substring(0, 7)}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(latestDeploy.created_at), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                            <Clock className="size-3" /> No deployments yet
                        </div>
                    )}
                </div>
            </div>

            <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto bg-muted/20">
                <div className="flex items-center justify-between w-full pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        Operational
                    </div>
                    {latestDeploy && (
                        <Badge variant="secondary" className={cn("capitalize h-5 px-2 text-[10px]",
                            latestDeploy.status === 'success' ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" :
                                latestDeploy.status === 'failed' ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-muted"
                        )}>
                            {latestDeploy.status}
                        </Badge>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
