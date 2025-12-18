
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Clock, XCircle, TrendingUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface DoraMetricsProps {
    deploymentFrequency: {
        value: string;
        label: string;
        rating: 'Low' | 'Medium' | 'High' | 'Elite';
    };
    leadTime: {
        value: string;
        label: string;
        rating: 'Low' | 'Medium' | 'High' | 'Elite';
    };
    changeFailureRate: {
        value: string;
        label: string; // e.g., "5%"
        rating: 'Low' | 'Medium' | 'High' | 'Elite';
    };
    mttr: {
        value: string;
        label: string; // e.g., "1h 30m"
        rating: 'Low' | 'Medium' | 'High' | 'Elite';
    };
}

const RATING_COLORS = {
    Low: "text-red-500 bg-red-500/10 border-red-500/20",
    Medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    High: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    Elite: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
};

export function DoraMetricsCards({ metrics }: { metrics: DoraMetricsProps }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                title="Deployment Frequency"
                icon={TrendingUp}
                value={metrics.deploymentFrequency.value}
                subtext={metrics.deploymentFrequency.label}
                rating={metrics.deploymentFrequency.rating}
                description="How often your organization successfully releases to production."
            />
            <MetricCard
                title="Lead Time for Changes"
                icon={Clock}
                value={metrics.leadTime.value}
                subtext={metrics.leadTime.label}
                rating={metrics.leadTime.rating}
                description="The amount of time it takes a commit to get into production."
            />
            <MetricCard
                title="Change Failure Rate"
                icon={XCircle}
                value={metrics.changeFailureRate.value}
                subtext={metrics.changeFailureRate.label}
                rating={metrics.changeFailureRate.rating}
                description="The percentage of deployments causing a failure in production."
            />
            <MetricCard
                title="Mean Time to Restore"
                icon={Gauge}
                value={metrics.mttr.value}
                subtext={metrics.mttr.label}
                rating={metrics.mttr.rating}
                description="How long it takes to recover from a failure in production."
            />
        </div>
    );
}

interface MetricCardProps {
    title: string;
    icon: any;
    value: string;
    subtext: string;
    rating: keyof typeof RATING_COLORS;
    description: string;
}

function MetricCard({ title, icon: Icon, value, subtext, rating, description }: MetricCardProps) {
    return (
        <Card className="border-border bg-card shadow-sm hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-background border border-border text-muted-foreground">
                        <Icon className="size-5" />
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border cursor-help", RATING_COLORS[rating])}>
                                    {rating}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>DORA Rating: {rating}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="size-3 text-muted-foreground/50" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>{description}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-2xl font-bold tracking-tight">{value}</p>
                    <p className="text-xs text-muted-foreground">{subtext}</p>
                </div>
            </CardContent>
        </Card>
    );
}
