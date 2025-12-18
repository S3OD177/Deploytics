
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint {
    date: string;
    success: number;
    failed: number;
}

interface ChartProps {
    data: DataPoint[];
    period?: string; // '7d' | '30d' | '90d'
}

export function DeploymentFrequencyChart({ data, period = '30d' }: ChartProps) {
    const totalDeploys = data.reduce((acc, curr) => acc + curr.success + curr.failed, 0);

    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-card">
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-medium">Deployment Volume</CardTitle>
                        <CardDescription>Daily deployment frequency over the last {period}.</CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold">{totalDeploys}</span>
                        <span className="text-xs text-muted-foreground">Total Deploys</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[240px] w-full">
                    {data.length === 0 ? (
                        <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-muted rounded-md text-muted-foreground text-sm">
                            No deployment data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                <XAxis
                                    dataKey="date"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-sm p-3 shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{data.date}</span>
                                                        <div className="flex gap-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase text-emerald-500 font-bold">Success</span>
                                                                <span className="text-sm font-bold">{data.success}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] uppercase text-red-500 font-bold">Failed</span>
                                                                <span className="text-sm font-bold">{data.failed}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="success"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSuccess)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="failed"
                                    stroke="hsl(var(--destructive))"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorFailed)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
