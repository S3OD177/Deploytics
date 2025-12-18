
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Clock, GitCommit, Activity, MoreHorizontal, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function ProjectStats({ lastDeployment }: { lastDeployment: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Last Deployment Card */}
            <Card className="rounded-xl border-border bg-card hover:border-primary/50 transition-colors group">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <Rocket className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Last Deployment
                                </h3>
                                <p className="text-foreground font-semibold">
                                    {lastDeployment ? `Production #${lastDeployment.id.substring(0, 4)}` : "No Record"}
                                </p>
                            </div>
                        </div>
                        {lastDeployment && (
                            <span className={cn("text-xs font-medium px-2 py-1 rounded capitalize",
                                lastDeployment.status === 'success' ? "text-emerald-500 bg-emerald-500/10" :
                                    lastDeployment.status === 'failed' ? "text-rose-500 bg-rose-500/10" :
                                        "text-blue-500 bg-blue-500/10"
                            )}>
                                {lastDeployment.status}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-1">
                        <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {lastDeployment ? formatDistanceToNow(new Date(lastDeployment.created_at), { addSuffix: true }) : "--"}
                        </span>
                        <span>Duration: {lastDeployment?.duration_seconds ? `${lastDeployment.duration_seconds}s` : "--"}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Last Commit Card */}
            <Card className="rounded-xl border-border bg-card hover:border-primary/50 transition-colors group">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-muted/50 flex items-center justify-center text-foreground">
                                <GitCommit className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Last Commit
                                </h3>
                                <p
                                    className="text-foreground font-semibold line-clamp-1"
                                    title={lastDeployment?.commit_message}
                                >
                                    {lastDeployment?.commit_message || "No commits"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {lastDeployment && (
                        <div className="flex items-center gap-2 mb-3 pl-13">
                            <div className="size-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white">🤖</div>
                            <span className="text-xs text-foreground">Bot / User</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-1">
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground border border-border">
                            {lastDeployment?.commit_hash?.substring(0, 7) || "-------"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {lastDeployment ? formatDistanceToNow(new Date(lastDeployment.created_at), { addSuffix: true }) : "--"}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Health Card */}
            <Card className="rounded-xl border-border bg-card hover:border-primary/50 transition-colors group">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <Activity className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    System Health
                                </h3>
                                <p className="text-foreground font-semibold">100% Uptime</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="size-5" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-1">
                        <span className="flex items-center gap-1">
                            <Gauge className="size-3.5" />
                            Avg Latency
                        </span>
                        <span className="text-foreground font-medium">50ms</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
