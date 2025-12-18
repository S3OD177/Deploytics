import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Lightbulb, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AiInsightsProps {
    metrics: {
        deploymentFrequency: { value: string; rating: string };
        changeFailureRate: { value: string; rating: string };
        leadTime: { value: string; rating: string };
    };
}

export function AiInsights({ metrics }: AiInsightsProps) {
    // Determine a dynamic "insight" based on metrics
    let title = "Deployment Velocity is Stable";
    let message = "Your team is maintaining a healthy ship rate. No immediate action required.";
    let type: 'info' | 'warning' | 'success' = 'info';

    if (metrics.deploymentFrequency.rating === 'Low') {
        title = "Boost Deployment Frequency";
        message = "Current frequency is below elite standards. Try breaking down tasks into smaller PRs.";
        type = 'warning';
    } else if (metrics.changeFailureRate.rating === 'Low') {
        title = "Stability Alert";
        message = "High failure rate detected. Consider implementing automated smoke tests for production.";
        type = 'warning';
    } else if (metrics.leadTime.rating === 'Elite') {
        title = "Elite Velocity Detected";
        message = "Build times are optimized. Great job maintaining a lean CI/CD pipeline.";
        type = 'success';
    }

    return (
        <Card className="bg-primary/5 border-primary/10 overflow-hidden group hover:bg-primary/10 transition-all duration-300">
            <CardContent className="p-0">
                <div className="flex md:flex-row flex-col items-stretch">
                    <div className="p-4 flex items-center justify-center bg-primary/10 relative overflow-hidden group-hover:bg-primary/20 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                        <Sparkles className="size-6 text-primary relative z-10 animate-pulse" />
                    </div>
                    <div className="flex-1 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Insight</span>
                                <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] h-4">Beta</Badge>
                            </div>
                            <h4 className="font-bold text-base leading-tight">{title}</h4>
                            <p className="text-sm text-muted-foreground max-w-xl">{message}</p>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0 border-primary/20 hover:bg-primary/10 hover:text-primary gap-2">
                            <Lightbulb className="size-3.5" />
                            View Full Analysis
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
