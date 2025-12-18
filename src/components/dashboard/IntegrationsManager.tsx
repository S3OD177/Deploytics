;

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Github, Cloud, Database, Server, Loader2, Check, ExternalLink, Unplug } from "lucide-react";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
    {
        id: "github",
        name: "GitHub",
        description: "Track commits, PRs, and GitHub Actions",
        icon: Github,
        color: "text-white",
        bgColor: "bg-zinc-800",
        docsUrl: "https://github.com/settings/tokens",
        placeholder: "ghp_xxxxxxxxxxxx",
        fieldName: "access_token",
    },
    {
        id: "vercel",
        name: "Vercel",
        description: "Monitor deployments, domains, and logs",
        icon: Cloud,
        color: "text-black",
        bgColor: "bg-white",
        docsUrl: "https://vercel.com/account/tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
    },
    {
        id: "supabase",
        name: "Supabase",
        description: "Track database size, API calls, edge functions",
        icon: Database,
        color: "text-emerald-400",
        bgColor: "bg-emerald-950",
        docsUrl: "https://supabase.com/dashboard/account/tokens",
        placeholder: "sbp_xxxxxxxxxxxx",
        fieldName: "access_token",
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((integration) => {
                const status = getIntegrationStatus(integration.id);
                const isConnected = status?.status === 'connected';
                const isExpanded = expandedId === integration.id;
                const Icon = integration.icon;

                return (
                    <Card
                        key={integration.id}
                        className={cn(
                            "relative overflow-hidden transition-all duration-300",
                            isExpanded && "ring-2 ring-primary",
                            integration.comingSoon && "opacity-60"
                        )}
                    >
                        {isConnected && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
                        )}

                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2.5 rounded-lg", integration.bgColor)}>
                                        <Icon className={cn("size-5", integration.color)} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            {integration.name}
                                            {integration.comingSoon && (
                                                <Badge variant="secondary" className="text-[10px]">Soon</Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            {integration.description}
                                        </CardDescription>
                                    </div>
                                </div>
                                {isConnected && (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                        <Check className="size-3 mr-1" />
                                        Connected
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {isExpanded && !integration.comingSoon ? (
                                <div className="space-y-3 pt-3 border-t border-border">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Access Token</span>
                                        <a
                                            href={integration.docsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center gap-1"
                                        >
                                            Get token <ExternalLink className="size-3" />
                                        </a>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder={integration.placeholder}
                                        value={tokens[integration.id] || ''}
                                        onChange={(e) => setTokens(prev => ({ ...prev, [integration.id]: e.target.value }))}
                                        className="h-9 text-sm font-mono"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleConnect(integration.id)}
                                            disabled={isPending}
                                        >
                                            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Connect"}
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
                            ) : (
                                <div className="flex gap-2 pt-2">
                                    {isConnected ? (
                                        <>
                                            <Button size="sm" variant="outline" className="flex-1 text-xs" disabled>
                                                <Check className="size-3 mr-1" />
                                                Synced {status?.last_synced_at ? 'recently' : 'never'}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                                <Unplug className="size-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => !integration.comingSoon && setExpandedId(integration.id)}
                                            disabled={integration.comingSoon}
                                        >
                                            {integration.comingSoon ? "Coming Soon" : "Connect"}
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
