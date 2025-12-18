
import { Card, CardContent } from "@/components/ui/card";
import { Folder, ArrowUp, RefreshCw, AlertCircle } from "lucide-react";

export interface OverviewStatsProps {
    totalProjects?: number;
    activeBuilds?: number;
    failedDeploys?: number;
}

export function OverviewStats({ totalProjects = 12, activeBuilds = 3, failedDeploys = 1 }: OverviewStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Total Projects */}
            <Card className="rounded-xl border-border bg-card shadow-sm">
                <CardContent className="p-5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm font-medium">Total Projects</p>
                        <Folder className="size-5 text-muted-foreground/60" />
                    </div>
                    <div className="flex items-end gap-2 mt-2">
                        <p className="text-foreground text-3xl font-bold leading-none">{totalProjects}</p>
                        <span className="text-green-600 text-xs font-bold mb-1 flex items-center">
                            <ArrowUp className="size-3.5 mr-0.5" /> 2 this week
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Active Builds */}
            <Card className="rounded-xl border-border bg-card shadow-sm">
                <CardContent className="p-5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm font-medium">Active Builds</p>
                        <RefreshCw className="size-5 text-primary animate-spin-slow" />
                    </div>
                    <div className="flex items-end gap-2 mt-2">
                        <p className="text-foreground text-3xl font-bold leading-none">{activeBuilds}</p>
                        <span className="text-primary text-xs font-bold mb-1">In progress</span>
                    </div>
                </CardContent>
            </Card>

            {/* Failed Deployments */}
            <Card className="rounded-xl border-border bg-card shadow-sm">
                <CardContent className="p-5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm font-medium">Failed Deployments</p>
                        <AlertCircle className="size-5 text-red-500" />
                    </div>
                    <div className="flex items-end gap-2 mt-2">
                        <p className="text-foreground text-3xl font-bold leading-none">{failedDeploys}</p>
                        <span className="text-red-600 text-xs font-bold mb-1 flex items-center">
                            <ArrowUp className="size-3.5 mr-0.5" /> 1 today
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
