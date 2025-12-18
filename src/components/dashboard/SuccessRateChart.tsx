
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, startOfDay, isSameDay } from "date-fns";

interface Deployment {
    created_at: string;
    status: 'success' | 'failed' | 'building' | string;
}

interface SuccessRateChartProps {
    deployments: Deployment[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                <div className="font-bold text-muted-foreground mb-1">{payload[0].payload.date}</div>
                <div className="flex gap-2">
                    <span className="text-emerald-500 font-bold">
                        {payload[0].value}% Success
                    </span>
                    <span className="text-muted-foreground">
                        ({payload[0].payload.total} builds)
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export function SuccessRateChart({ deployments }: SuccessRateChartProps) {
    const data = useMemo(() => {
        const days = 14;
        const result = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(now, i);
            const dayStart = startOfDay(date);

            const dayDeploys = deployments.filter(d =>
                isSameDay(new Date(d.created_at), date)
            );

            const total = dayDeploys.length;
            const success = dayDeploys.filter(d => d.status === 'success').length;
            const rate = total > 0 ? (success / total) * 100 : null;

            result.push({
                date: format(date, "MMM dd"),
                rate: rate !== null ? Math.round(rate) : 0,
                total
            });
        }
        return result;
    }, [deployments]);

    const validDays = data.filter(d => d.total > 0);
    const avgRate = validDays.length > 0
        ? Math.round(validDays.reduce((acc, curr) => acc + curr.rate, 0) / validDays.length)
        : 0;

    return (
        <Card className="border-border/50 bg-card/50">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Success Rate (14 Days)
                </CardTitle>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                        {avgRate}%
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-[80px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="rate"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorRate)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
