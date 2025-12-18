
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

export function PredictiveInsights() {
    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-100 dark:border-indigo-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                    Deploytics AI Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded bg-white/50 dark:bg-black/20">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                        <p className="text-sm font-medium">Velocity Forecast</p>
                        <p className="text-xs text-muted-foreground">
                            Based on your recent cadence, you are on track to ship <span className="font-bold text-foreground">15% more features</span> this week compared to last week.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded bg-white/50 dark:bg-black/20">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-1" />
                    <div>
                        <p className="text-sm font-medium">Weekend Warning</p>
                        <p className="text-xs text-muted-foreground">
                            Deployments on Fridays have a <span className="font-bold text-foreground">12% higher failure rate</span> historically. Consider deploying on Monday.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
