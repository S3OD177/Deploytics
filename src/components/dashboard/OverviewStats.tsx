
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, ArrowUp, ArrowDown, Activity, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OverviewStatsProps {
    totalProjects?: number;
    projectTrend?: string;
    projectTrendUp?: boolean;
    activeBuilds?: number;
    activeBuildsTrend?: string; // e.g. "3 running" or "In progress"
    failedDeploys?: number;
    failedDeploysTrend?: string;
    failedDeploysTrendUp?: boolean; // false usually for failed stuff
}

export function OverviewStats({
    totalProjects = 0,
    projectTrend = "0 this week",
    projectTrendUp = true,
    activeBuilds = 0,
    activeBuildsTrend = "0 active",
    failedDeploys = 0,
    failedDeploysTrend = "0 today",
    failedDeploysTrendUp = true // Default to true contextually (e.g. "0 failed" is good) but logic in parent handles "bad" trends
}: OverviewStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
                title="Total Projects"
                value={totalProjects}
                trend={projectTrend}
                trendUp={projectTrendUp}
                icon={Folder}
                iconClassName="text-blue-500"
                bgClassName="bg-blue-500/10"
            />
            <StatCard
                title="Active Builds"
                value={activeBuilds}
                trend={activeBuildsTrend}
                trendUp={true} // Always pulsing for active
                icon={Activity}
                iconClassName="text-amber-500 animate-pulse"
                bgClassName="bg-amber-500/10"
            />
            <StatCard
                title="Failed Deployments"
                value={failedDeploys}
                trend={failedDeploysTrend}
                trendUp={failedDeploysTrendUp}
                isError={true}
                icon={AlertCircle}
                iconClassName="text-red-500"
                bgClassName="bg-red-500/10"
            />
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: number | string;
    trend: string;
    trendUp?: boolean;
    isError?: boolean;
    icon: React.ElementType;
    iconClassName?: string;
    bgClassName?: string;
}

function StatCard({ title, value, trend, trendUp, isError, icon: Icon, iconClassName, bgClassName }: StatCardProps) {
    return (
        <Card className="rounded-xl border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <div className={cn("p-2 rounded-lg", bgClassName)}>
                            <Icon className={cn("h-6 w-6", iconClassName)} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{title}</p>
                            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium">
                    {isError ? (
                        <span className="text-red-500 flex items-center">
                            <ArrowUp className="mr-1 h-3 w-3" /> {trend}
                        </span>
                    ) : (
                        <span className={cn("flex items-center", title === "Active Builds" ? "text-amber-500" : "text-emerald-500")}>
                            {title === "Active Builds" ? (
                                <Activity className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                                <ArrowUp className="mr-1 h-3 w-3" />
                            )}
                            {trend}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
