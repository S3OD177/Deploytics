;

import { Download, Info, TrendingUp, MoreHorizontal, ArrowUp, Minus, ArrowDown, Rocket, GitCommit, Database, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Cost Constants
const COST_PER_BUILD_MIN = 0.05;
const COST_PER_BW_GB = 0.10;
const INCLUDED_BUILD_MINS = 500;
const INCLUDED_BW_GB = 100;

interface BillingOverviewProps {
    buildMinutes: number;
    bandwidthGB: number;
    totalDeploysLast24h: number;
    projectSignals: any[];
}

export function BillingOverview({ buildMinutes, bandwidthGB, totalDeploysLast24h, projectSignals }: BillingOverviewProps) {

    // Calculate Estimated Cost
    const billableMins = Math.max(0, buildMinutes - INCLUDED_BUILD_MINS);
    const billableBW = Math.max(0, bandwidthGB - INCLUDED_BW_GB);

    const estCost = (billableMins * COST_PER_BUILD_MIN) + (billableBW * COST_PER_BW_GB);

    return (
        <div className="flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <span>Billing</span>
                    <span className="text-[10px] scale-75">/</span>
                    <span className="text-foreground">Cost Awareness</span>
                </div>
                <div className="flex justify-between items-end flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Cost Awareness</h2>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            Estimated usage trends across your connected services
                        </p>
                    </div>
                    <Button variant="outline" className="gap-2 bg-card border-border hover:bg-accent text-foreground">
                        <Download className="size-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Soft Warning Alert */}
            {estCost > 50 && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Info className="size-5 text-amber-500 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        <p className="text-amber-500 text-sm font-medium">Usage Spike Detected</p>
                        <p className="text-amber-500/80 text-sm">
                            High estimated cost detected based on current velocity.
                        </p>
                    </div>
                </div>
            )}

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric Card */}
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <p className="text-muted-foreground text-sm font-medium">Est. Monthly Usage</p>
                            <Info className="size-4 text-muted-foreground cursor-help" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground tracking-tight tabular-nums">
                                ${estCost.toFixed(2)}
                            </p>
                            <p className="text-muted-foreground text-xs mt-2">
                                {billableMins > 0 ? `${billableMins} billable mins` : 'Within free tier'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Trend Card */}
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <p className="text-muted-foreground text-sm font-medium">Usage Trend</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <TrendingUp className="size-3.5 mr-1" />
                                +0%
                            </span>
                        </div>
                        <div>
                            <p className="text-foreground font-medium">Stable vs Last Month</p>
                            <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "10%" }}></div>
                            </div>
                            <p className="text-muted-foreground text-xs mt-2">Consistent usage</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Card */}
                <Card className="border-border bg-card shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <CardContent className="p-6 flex flex-col gap-4 relative z-10">
                        <div className="flex justify-between items-start">
                            <p className="text-muted-foreground text-sm font-medium">Risk Indicator</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Low
                            </span>
                        </div>
                        <div>
                            <p className="text-foreground text-lg font-semibold">Healthy</p>
                            <p className="text-muted-foreground text-xs mt-1">Within expected limits</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Signals */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-foreground text-lg font-bold">Usage Signals</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SignalCard icon={Rocket} level="Live" levelColor="blue" title="Deployments (24h)" value={totalDeploysLast24h.toString()} unit="" />
                    <SignalCard icon={GitCommit} level="Tracked" levelColor="emerald" title="Total Build Mins" value={buildMinutes.toString()} unit="mins" />
                    <SignalCard icon={Database} level="Est" levelColor="orange" title="Bandwidth Usage" value={bandwidthGB.toFixed(1)} unit="GB" />
                </div>
            </div>

            {/* Project Cost Signals Table */}
            <div className="flex flex-col gap-4">
                <h3 className="text-foreground text-lg font-bold">Project Cost Signals</h3>
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Project Name</th>
                                    <th className="px-6 py-4 font-medium">Activity Level</th>
                                    <th className="px-6 py-4 font-medium">Est. Impact</th>
                                    <th className="px-6 py-4 font-medium">Trend</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-foreground">
                                {projectSignals.length > 0 ? projectSignals.map((p) => (
                                    <CostRow
                                        key={p.id}
                                        name={p.name}
                                        icon={Rocket}
                                        level={p.activityLevel}
                                        levelColor={p.activityLevel === 'High' ? 'orange' : 'blue'}
                                        impact={p.impact}
                                        trend={p.trend}
                                        trendIcon={Minus}
                                        trendColor="text-muted-foreground"
                                    />
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No active projects found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-6 pb-2">
                <p className="text-muted-foreground text-xs text-center">
                    Estimates are for planning purposes only and do not reflect final invoices. Actual costs may vary based on provider billing cycles and usage tiers.
                </p>
            </div>
        </div>
    );
}

function SignalCard({ icon: Icon, level, levelColor, title, value, unit }: any) {
    const levelStyles: any = {
        red: "bg-red-500/10 text-red-500 border-red-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        orange: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    };

    return (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors cursor-default group">
            <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-background border border-border text-muted-foreground group-hover:text-primary transition-colors">
                    <Icon className="size-5" />
                </div>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", levelStyles[levelColor])}>
                    {level}
                </span>
            </div>
            <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{title}</p>
                <p className="text-foreground text-xl font-bold mt-1">{value} <span className="text-muted-foreground text-sm font-normal">{unit}</span></p>
            </div>
        </div>
    )
}

function CostRow({ name, icon: Icon, level, levelColor, impact, trend, trendIcon: TrendIcon, trendColor }: any) {
    const badgeStyle = {
        orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    } as any;

    const dotStyle = {
        orange: "bg-orange-500",
        blue: "bg-blue-500",
        emerald: "bg-emerald-500"
    } as any;

    return (
        <tr className="hover:bg-muted/5 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                        <Icon className="size-4" />
                    </div>
                    <span className="font-medium">{name}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", badgeStyle[levelColor])}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", dotStyle[levelColor])}></span> {level}
                </span>
            </td>
            <td className="px-6 py-4 text-muted-foreground">{impact}</td>
            <td className="px-6 py-4">
                <span className={cn("flex items-center text-xs font-medium", trendColor)}>
                    <TrendIcon className="size-3.5 mr-1" />
                    {trend}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="size-5" />
                </button>
            </td>
        </tr>
    )
}
