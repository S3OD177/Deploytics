
import { Check, Rocket, GitMerge, AlertTriangle, GitCommit, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export function TimelineFeed({ deployments }: { deployments: any[] }) {
    if (!deployments || deployments.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No recent activity.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-1">
                <h3 className="text-lg font-semibold text-foreground">Activity Log</h3>
                <div className="flex p-1 bg-muted/50 rounded-lg self-start sm:self-auto space-x-1">
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-card text-foreground shadow-sm transition-all">All</button>
                    {/* Filter buttons disabled for MVP */}
                </div>
            </div>

            <div className="flex flex-col relative pl-2">
                {deployments.map((deploy, index) => {
                    const isLast = index === deployments.length - 1;
                    const isSuccess = deploy.status === 'success';
                    const isFailed = deploy.status === 'failed';

                    return (
                        <div key={deploy.id} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className={cn("size-8 rounded-full border-2 border-background flex items-center justify-center shrink-0 z-10",
                                    isSuccess ? "bg-emerald-500/20 text-emerald-500" :
                                        isFailed ? "bg-rose-500/20 text-rose-500" : "bg-primary/20 text-primary"
                                )}>
                                    {isSuccess ? <Check className="size-4" /> : isFailed ? <AlertTriangle className="size-4" /> : <Rocket className="size-4" />}
                                </div>
                                <div className={cn("w-px h-full bg-border my-1", isLast ? "hidden" : "")}></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {isSuccess ? 'Deployment Succeeded' : isFailed ? 'Deployment Failed' : 'Deployment Started'}
                                        </h4>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(deploy.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {deploy.commit_message || "No message"}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border uppercase",
                                            isSuccess ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                                                isFailed ? "text-rose-500 bg-rose-500/10 border-rose-500/20" : "text-blue-500 bg-blue-500/10 border-blue-500/20")}>
                                            {deploy.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {deploy.commit_hash?.substring(0, 7)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
