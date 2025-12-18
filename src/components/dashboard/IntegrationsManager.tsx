
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Github, Cloud, Database, Server, Loader2, Check, ExternalLink, Unplug, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const INTEGRATIONS = [
    {
        id: "github",
        name: "GitHub",
        description: "Connect your repositories to track commits, pull requests, and CI/CD workflows.",
        icon: Github,
        color: "text-white",
        bgColor: "bg-zinc-900",
        docsUrl: "https://github.com/settings/tokens",
        placeholder: "ghp_xxxxxxxxxxxx",
        fieldName: "access_token",
        dataFetched: [
            "Repository names & details",
            "Commit history & messages",
            "Pull request status updates",
            "GitHub Actions workflow runs"
        ],
        steps: [
            "Go to GitHub Settings > Developer settings",
            "Select 'Personal access tokens' > 'Tokens (classic)'",
            "Generate new token with 'repo' scope",
            "Copy and paste the token here"
        ]
    },
    {
        id: "vercel",
        name: "Vercel",
        description: "Monitor your deployments, domains, and build logs in real-time.",
        icon: Cloud,
        color: "text-black dark:text-white",
        bgColor: "bg-white dark:bg-black",
        docsUrl: "https://vercel.com/account/tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
        dataFetched: [
            "Project deployment status",
            "Build duration & errors",
            "Domain configuration",
            "Serverless function logs"
        ],
        steps: [
            "Naviage to Vercel Account Settings",
            "Go to the 'Tokens' section",
            "Create a new token with 'Full Access'",
            "Copy the token secret"
        ]
    },
    {
        id: "supabase",
        name: "Supabase",
        description: "Track your database health, storage usage, and API requests.",
        icon: Database,
        color: "text-emerald-400",
        bgColor: "bg-emerald-950",
        docsUrl: "https://supabase.com/dashboard/account/tokens",
        placeholder: "sbp_xxxxxxxxxxxx",
        fieldName: "access_token",
        dataFetched: [
            "Database size & storage used",
            "API request counts",
            "Auth user statistics",
            "Project health metrics"
        ],
        steps: [
            "Go to Supabase Dashboard > Account",
            "Select 'Access Tokens'",
            "Generate a new token",
            "Copy the resulting API key"
        ]
    },
    {
        id: "netlify",
        name: "Netlify",
        description: "Deployments, bandwidth, and forms",
        icon: Cloud,
        color: "text-teal-400",
        bgColor: "bg-teal-950",
        docsUrl: "https://app.netlify.com/user/applications#personal-access-tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
        comingSoon: true,
        dataFetched: ["Deployments", "Bandwidth"],
        steps: []
    },
    {
        id: "railway",
        name: "Railway",
        description: "Services, usage, and logs",
        icon: Server,
        color: "text-purple-400",
        bgColor: "bg-purple-950",
        docsUrl: "https://railway.app/account/tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
        comingSoon: true,
        dataFetched: ["Service status", "Usage metrics"],
        steps: []
    },
    {
        id: "render",
        name: "Render",
        description: "Services, deployments, and metrics",
        icon: Server,
        color: "text-blue-400",
        bgColor: "bg-blue-950",
        docsUrl: "https://dashboard.render.com/u/settings#api-keys",
        placeholder: "rnd_xxxxxxxxxxxx",
        fieldName: "access_token",
        comingSoon: true,
        dataFetched: ["Deployments", "Service health"],
        steps: []
    },
];

interface IntegrationData {
    id: string;
    provider: string;
    status: string;
    config: any;
    last_synced_at: string | null;
}

export function IntegrationsManager({
    integrations,
    onSave
}: {
    integrations: IntegrationData[];
    onSave: (provider: string, token: string) => Promise<{ error?: string }>;
}) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [tokens, setTokens] = useState<Record<string, string>>({});
    const [isPending, startTransition] = useTransition();

    const getIntegrationStatus = (providerId: string) => {
        return integrations.find(i => i.provider === providerId);
    };

    const handleConnect = (providerId: string) => {
        const token = tokens[providerId];
        if (!token) {
            toast.error("Please enter an access token");
            return;
        }

        startTransition(async () => {
            const result = await onSave(providerId, token);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${providerId} connected successfully!`);
                setTokens(prev => ({ ...prev, [providerId]: '' }));
                setExpandedId(null);
            }
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {INTEGRATIONS.map((integration) => {
                const status = getIntegrationStatus(integration.id);
                const isConnected = status?.status === 'connected';
                const isExpanded = expandedId === integration.id;
                const Icon = integration.icon;

                return (
                    <Card
                        key={integration.id}
                        className={cn(
                            "relative overflow-hidden transition-all duration-300 border-border/50 bg-card/50 hover:bg-card hover:border-border",
                            isExpanded && "ring-1 ring-primary border-primary/50 shadow-lg scale-[1.01]",
                            integration.comingSoon && "opacity-60"
                        )}
                    >
                        {isConnected && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
                        )}

                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-3 rounded-xl shadow-sm ring-1 ring-inset ring-white/10", integration.bgColor)}>
                                        <Icon className={cn("size-6", integration.color)} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {integration.name}
                                            {integration.comingSoon && (
                                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-medium">Soon</Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="text-sm mt-1 line-clamp-2">
                                            {integration.description}
                                        </CardDescription>
                                    </div>
                                </div>
                                {isConnected && (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 h-6">
                                        <Check className="size-3.5 mr-1.5" />
                                        Connected
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0 space-y-4">
                            {/* Data Fetched Section - Always visible to explain value */}
                            {!integration.comingSoon && (
                                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                                        <Info className="size-3.5" />
                                        WHAT WE FETCH
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {integration.dataFetched.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                                                <div className="size-1 rounded-full bg-primary/50" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isExpanded && !integration.comingSoon ? (
                                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">

                                    {/* Connection Steps */}
                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            How to connect
                                        </span>
                                        <ol className="text-xs space-y-2 text-muted-foreground leading-relaxed">
                                            {integration.steps.map((step, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="font-mono text-primary/70">{i + 1}.</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                        <a
                                            href={integration.docsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1 pl-5"
                                        >
                                            Open settings directly <ExternalLink className="size-3" />
                                        </a>
                                    </div>

                                    {/* Input Area */}
                                    <div className="space-y-3 pt-2 border-t border-border/50">
                                        <div className="space-y-1">
                                            <span className="text-xs font-medium">Access Token</span>
                                            <Input
                                                type="password"
                                                placeholder={integration.placeholder}
                                                value={tokens[integration.id] || ''}
                                                onChange={(e) => setTokens(prev => ({ ...prev, [integration.id]: e.target.value }))}
                                                className="h-9 text-sm font-mono bg-background"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleConnect(integration.id)}
                                                disabled={isPending}
                                            >
                                                {isPending ? <Loader2 className="size-4 animate-spin" /> : "Verify & Connect"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setExpandedId(null)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-2">
                                    {isConnected ? (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="flex-1 text-xs h-8" disabled>
                                                <Check className="size-3 mr-1" />
                                                Synced {status?.last_synced_at ? 'recently' : 'never'}
                                            </Button>
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 p-0">
                                                            <Unplug className="size-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Disconnect Integration</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full h-9"
                                            onClick={() => !integration.comingSoon && setExpandedId(integration.id)}
                                            disabled={integration.comingSoon}
                                        >
                                            {integration.comingSoon ? "Coming Soon" : "Configure"}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
