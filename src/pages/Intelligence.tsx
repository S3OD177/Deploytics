
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Bot, ShieldAlert, TrendingUp, Code,
    Zap, ExternalLink, Activity, Sparkles,
    Play, Pause, Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
    {
        id: "cost_cutter",
        name: "CostCutter AI",
        role: "Financial Optimization",
        description: "Analyzes resource utilization across AWS/Vercel to identify waste. Auto-scales down idle instances.",
        icon: Zap,
        color: "text-amber-400 font-bold",
        bg: "bg-amber-400/10 border-amber-400/20",
        stats: "Saved $450 this month",
        active: true
    },
    {
        id: "sentry_bot",
        name: "SentryBot",
        role: "Incident Response",
        description: "Triages incoming exceptions. Auto-reverts bad deployments if error rates spike > 1%.",
        icon: ShieldAlert,
        color: "text-red-400 font-bold",
        bg: "bg-red-400/10 border-red-400/20",
        stats: "Triaged 12 incidents",
        active: false
    },
    {
        id: "scale_master",
        name: "ScaleMaster",
        role: "Traffic Prediction",
        description: "Predicts viral spikes using social sentiment analysis and pre-warms serverless functions.",
        icon: TrendingUp,
        color: "text-emerald-400 font-bold",
        bg: "bg-emerald-400/10 border-emerald-400/20",
        stats: "99.99% Uptime predicted",
        active: true
    },
    {
        id: "code_cop",
        name: "CodeCop",
        role: "Compliance & Security",
        description: "Scans every PR for secret leaks, PII violations, and licensing issues before merge.",
        icon: Code,
        color: "text-blue-400 font-bold",
        bg: "bg-blue-400/10 border-blue-400/20",
        stats: "Blocked 3 critical leaks",
        active: true
    }
];

export default function Intelligence() {
    const [agentStates, setAgentStates] = useState(
        AGENTS.reduce((acc, agent) => ({ ...acc, [agent.id]: agent.active }), {} as Record<string, boolean>)
    );

    const toggleAgent = (id: string, name: string) => {
        setAgentStates(prev => {
            const newState = !prev[id];
            toast.success(`${name} ${newState ? 'Activated' : 'Deactivated'}`, {
                description: newState ? "Agent is now monitoring real-time streams." : "Agent monitoring paused.",
                icon: newState ? <Sparkles className="size-4 text-emerald-500" /> : <Pause className="size-4 text-amber-500" />
            });
            return { ...prev, [id]: newState };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Bot className="size-8 text-primary" />
                    AI Command Center
                </h1>
                <p className="text-muted-foreground">
                    Deploy autonomous agents to optimize, secure, and scale your infrastructure.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {AGENTS.map((agent) => {
                    const isActive = agentStates[agent.id];
                    const Icon = agent.icon;

                    return (
                        <Card key={agent.id} className={cn("relative overflow-hidden transition-all duration-300", isActive ? "border-primary/50 bg-card/50" : "opacity-80 border-border/50")}>
                            {isActive && (
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-primary/10 to-transparent blur-3xl rounded-full translate-x-1/2 -translate-y-1/2`} />
                                </div>
                            )}

                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className={cn("p-3 rounded-xl shadow-lg ring-1 ring-inset ring-white/10", agent.bg)}>
                                            <Icon className={cn("size-6", agent.color)} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                {agent.name}
                                                <Badge variant={isActive ? "default" : "secondary"} className={cn("ml-2 text-[10px] h-5", isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "")}>
                                                    {isActive ? "ACTIVE" : "PAUSED"}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="font-mono text-xs mt-1 text-primary/80">
                                                {agent.role}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={isActive ? "outline" : "default"}
                                        className={cn("w-24 gap-2", isActive ? "text-red-400 hover:text-red-500 border-red-500/20 hover:bg-red-500/10" : "")}
                                        onClick={() => toggleAgent(agent.id, agent.name)}
                                    >
                                        {isActive ? "Pause" : "Deploy"}
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 relative z-10">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {agent.description}
                                </p>

                                {isActive ? (
                                    <div className="bg-black/50 rounded-lg p-3 font-mono text-xs border border-white/5 shadow-inner">
                                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                            <Activity className="size-3 animate-pulse" />
                                            <span>Processing Stream...</span>
                                        </div>
                                        <div className="space-y-1 text-muted-foreground">
                                            <p>root@agent:~# analyzing metrics...</p>
                                            <p className="text-primary/70">{agent.stats}</p>
                                            <span className="animate-pulse">_</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs border border-transparent text-muted-foreground flex items-center gap-2 justify-center h-[86px]">
                                        <Pause className="size-4 opacity-50" />
                                        Agent Offline
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/20 p-6 flex flex-col items-center justify-center text-center space-y-4">
                <Terminal className="size-10 text-muted-foreground/50" />
                <div>
                    <h3 className="text-lg font-semibold">Custom Agent Builder</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                        Train your own models on project data. Supports Llama 3, GPT-4o, and Claude 3.5 Sonnet.
                    </p>
                </div>
                <Button variant="secondary" disabled>
                    Coming Soon in Cluster 3
                </Button>
            </div>
        </div>
    );
}
