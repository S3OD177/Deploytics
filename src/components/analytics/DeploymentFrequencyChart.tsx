
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
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
                            <BarChart data={data}>
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
                                    cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="rounded-lg border border-border bg-popover p-2 shadow-md">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">Success</span>
                                                            <span className="font-bold text-emerald-500">{data.success}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[0.70rem] uppercase text-muted-foreground">Failed</span>
                                                            <span className="font-bold text-red-500">{data.failed}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="success"
                                    stackId="a"
                                    fill="hsl(var(--primary))"
                                    radius={[0, 0, 4, 4]}
                                    maxBarSize={40}
                                />
                                <Bar
                                    dataKey="failed"
                                    stackId="a"
                                    fill="hsl(var(--destructive))"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
