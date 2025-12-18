
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Check, ExternalLink, Unplug, Info, RefreshCw, Search } from "lucide-react";
import { Icons } from "@/components/icons";
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
        icon: Icons.GitHub,
        color: "text-white",
        bgColor: "bg-zinc-900",
        docsUrl: "https://github.com/settings/tokens",
        placeholder: "ghp_xxxxxxxxxxxx",
        fieldName: "access_token",
        fetchOptions: [
            { id: "repos", label: "Repositories", description: "Read-only access to repository metadata", default: true },
            { id: "commits", label: "Commits", description: "Sync commit history and authors", default: true },
            { id: "prs", label: "Pull Requests", description: "Track PR status and reviews", default: true },
            { id: "actions", label: "Actions", description: "Monitor workflow runs and status", default: true },
            { id: "issues", label: "Issues", description: "Track open issues and bugs", default: false },
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
        icon: Icons.Vercel,
        color: "text-black dark:text-white",
        bgColor: "bg-white dark:bg-black",
        docsUrl: "https://vercel.com/account/tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
        fetchOptions: [
            { id: "deployments", label: "Deployments", description: "Status, duration, and commit info", default: true },
            { id: "domains", label: "Domains", description: "DNS configuration and SSL status", default: true },
            { id: "logs", label: "Build Logs", description: "Error logs and build output", default: false },
            { id: "analytics", label: "Web Vitals", description: "Real-time performance metrics", default: false },
        ],
        steps: [
            "Navigate to Vercel Account Settings",
            "Go to the 'Tokens' section",
            "Create a new token with 'Full Access'",
            "Copy the token secret"
        ]
    },
    {
        id: "supabase",
        name: "Supabase",
        description: "Track your database health, storage usage, and API requests.",
        icon: Icons.Supabase,
        color: "text-emerald-400",
        bgColor: "bg-emerald-950",
        docsUrl: "https://supabase.com/dashboard/account/tokens",
        placeholder: "sbp_xxxxxxxxxxxx",
        fieldName: "access_token",
        fetchOptions: [
            { id: "database", label: "Database Health", description: "Size, connections, and cache hit rate", default: true },
            { id: "auth", label: "Auth Stats", description: "Active users and sign-ins", default: true },
            { id: "storage", label: "Storage", description: "Bucket usage and bandwidth", default: false },
            { id: "functions", label: "Edge Functions", description: "Invocations and error rates", default: false },
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
        icon: Icons.Netlify,
        color: "text-teal-400",
        bgColor: "bg-teal-950",
        docsUrl: "https://app.netlify.com/user/applications#personal-access-tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
        comingSoon: true,
        fetchOptions: [],
        steps: []
    },
    {
        id: "railway",
        name: "Railway",
        description: "Services, usage, and logs",
        icon: Icons.Railway,
        color: "text-purple-400",
        bgColor: "bg-purple-950",
        docsUrl: "https://railway.app/account/tokens",
        placeholder: "xxxxxxxxxxxxxxxx",
        fieldName: "access_token",
        comingSoon: true,
        fetchOptions: [],
        steps: []
    },
    {
        id: "render",
        name: "Render",
        description: "Services, deployments, and metrics",
        icon: Icons.Render,
        color: "text-blue-400",
        bgColor: "bg-blue-950",
        docsUrl: "https://dashboard.render.com/u/settings#api-keys",
        placeholder: "rnd_xxxxxxxxxxxx",
        fieldName: "access_token",
        comingSoon: true,
        fetchOptions: [],
        steps: []
    },
];

interface IntegrationData {
    id: string;
    provider: string;
    status: string;
    config: {
        access_token?: string;
        selected_scopes?: string[];
        [key: string]: any;
    };
    last_synced_at: string | null;
}

export function IntegrationsManager({
    integrations,
    onSave
}: {
    integrations: IntegrationData[];
    onSave: (provider: string, token: string, scopes: string[]) => Promise<{ error?: string }>;
}) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [tokens, setTokens] = useState<Record<string, string>>({});
    const [selectedScopes, setSelectedScopes] = useState<Record<string, string[]>>({});
    const [isPending, startTransition] = useTransition();

    const getIntegrationStatus = (providerId: string) => {
        return integrations.find(i => i.provider === providerId);
    };

    const handleConnect = (providerId: string) => {
        const token = tokens[providerId];
        const scopes = selectedScopes[providerId] || INTEGRATIONS.find(i => i.id === providerId)?.fetchOptions?.filter(o => o.default).map(o => o.id) || [];

        if (!token) {
            toast.error("Please enter an access token");
            return;
        }

        if (scopes.length === 0) {
            toast.error("Please select at least one data point to fetch");
            return;
        }

        startTransition(() => {
            (async () => {
                const result = await onSave(providerId, token, scopes);
                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(`${providerId} connected successfully!`);
                    setTokens(prev => ({ ...prev, [providerId]: '' }));
                    setExpandedId(null);
                }
            })();
        });
    };

    const toggleScope = (providerId: string, scopeId: string) => {
        setSelectedScopes(prev => {
            const current = prev[providerId] || INTEGRATIONS.find(i => i.id === providerId)?.fetchOptions?.filter(o => o.default).map(o => o.id) || [];
            if (current.includes(scopeId)) {
                return { ...prev, [providerId]: current.filter(id => id !== scopeId) };
            } else {
                return { ...prev, [providerId]: [...current, scopeId] };
            }
        });
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const getCategory = (id: string) => {
        if (['github'].includes(id)) return 'code';
        if (['vercel', 'netlify', 'render'].includes(id)) return 'hosting';
        if (['supabase', 'railway'].includes(id)) return 'database';
        return 'other';
    };

    const filteredIntegrations = INTEGRATIONS.filter(integration => {
        const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            integration.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || getCategory(integration.id) === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
                {/* Tabs */}
                <div className="flex p-1 bg-muted/50 border border-border rounded-lg gap-1 w-full sm:w-auto overflow-x-auto">
                    {[
                        { id: "all", label: "All Apps" },
                        { id: "code", label: "Git & Code" },
                        { id: "hosting", label: "Hosting" },
                        { id: "database", label: "Database" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search integrations..."
                        className="pl-9 h-9 bg-background/50 focus:bg-background transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 animate-in fade-in zoom-in-95 duration-300">
                {filteredIntegrations.map((integration) => {
                    const status = getIntegrationStatus(integration.id);
                    const isConnected = status?.status === 'connected';
                    const isExpanded = expandedId === integration.id;
                    const Icon = integration.icon;

                    const currentScopes = selectedScopes[integration.id] || integration.fetchOptions?.filter(o => o.default).map(o => o.id) || [];

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
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-xl shadow-sm ring-1 ring-inset ring-white/10", integration.bgColor)}>
                                            <Icon className={cn("size-6", integration.color)} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2 group">
                                                {integration.name}
                                                {!integration.comingSoon && (
                                                    <a
                                                        href={integration.docsUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary p-0.5 rounded-md hover:bg-muted"
                                                        title="Go to Provider Settings"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="size-3.5" />
                                                    </a>
                                                )}
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
                                {!isExpanded && !integration.comingSoon && (
                                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                                            <Info className="size-3.5" />
                                            {isConnected ? "ACTIVELY SYNCING" : "WHAT WE FETCH"}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(isConnected
                                                ? integration.fetchOptions?.filter(o => status?.config?.selected_scopes?.includes(o.id))
                                                : integration.fetchOptions?.filter(o => o.default)
                                            )?.map((option) => (
                                                <Badge key={option.id} variant="secondary" className="text-[10px] px-2 h-5 bg-secondary/50 font-normal">
                                                    {option.label}
                                                </Badge>
                                            ))}
                                            {isConnected && (status?.config?.selected_scopes?.length || 0) < (integration.fetchOptions?.length || 0) && (
                                                <span className="text-[10px] text-muted-foreground self-center ml-1">
                                                    +{(integration.fetchOptions?.length || 0) - (status?.config?.selected_scopes?.length || 0)} more available
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isExpanded && !integration.comingSoon ? (
                                    <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">

                                        {/* Data Selection */}
                                        <div className="space-y-3">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                                                Select Data to Sync
                                            </span>
                                            <div className="grid grid-cols-1 gap-2">
                                                {integration.fetchOptions?.map((option) => (
                                                    <div
                                                        key={option.id}
                                                        className={cn(
                                                            "flex items-start gap-3 p-2 rounded-lg border transition-colors cursor-pointer",
                                                            currentScopes.includes(option.id)
                                                                ? "bg-primary/5 border-primary/20"
                                                                : "bg-transparent border-border hover:bg-muted/50"
                                                        )}
                                                        onClick={() => toggleScope(integration.id, option.id)}
                                                    >
                                                        <Checkbox
                                                            id={`${integration.id}-${option.id}`}
                                                            checked={currentScopes.includes(option.id)}
                                                            onCheckedChange={() => toggleScope(integration.id, option.id)}
                                                            className="mt-0.5"
                                                        />
                                                        <div className="space-y-0.5">
                                                            <label
                                                                htmlFor={`${integration.id}-${option.id}`}
                                                                className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {option.label}
                                                            </label>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Connection Steps */}
                                        <div className="pt-2 border-t border-border/50 space-y-4">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                        Step 1: Get Access Token
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-2 text-primary border-primary/20 hover:border-primary/50 hover:bg-primary/5 font-bold shadow-sm"
                                                        asChild
                                                    >
                                                        <a href={integration.docsUrl} target="_blank" rel="noreferrer">
                                                            Open {integration.name} Settings <ExternalLink className="size-3.5" />
                                                        </a>
                                                    </Button>
                                                </div>

                                                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        <Info className="size-3" />
                                                        Instructions
                                                    </div>
                                                    <ol className="text-xs space-y-2 text-muted-foreground leading-relaxed pl-1">
                                                        {integration.steps.map((step, i) => (
                                                            <li key={i} className="flex gap-2">
                                                                <span className="font-mono text-primary/70 font-bold">{i + 1}.</span>
                                                                <span>{step}</span>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>

                                            {/* Input Area */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                        Step 2: Enter Token
                                                    </span>
                                                </div>
                                                <Input
                                                    type="password"
                                                    placeholder={integration.placeholder}
                                                    value={tokens[integration.id] || ''}
                                                    onChange={(e) => setTokens(prev => ({ ...prev, [integration.id]: e.target.value }))}
                                                    className="h-9 text-sm font-mono bg-background border-primary/20 focus:border-primary shadow-inner"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 font-bold shadow-md hover:shadow-lg transition-all"
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
                                    </div>
                                ) : (
                                    <div className="pt-2">
                                        {isConnected ? (
                                            <div className="flex gap-2">
                                                <div className="flex gap-2 flex-1">
                                                    <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => {
                                                        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                                                            loading: 'Syncing...',
                                                            success: 'Synced successfully',
                                                            error: 'Failed to sync'
                                                        });
                                                    }}>
                                                        <RefreshCw className="size-3 mr-1.5" />
                                                        Sync Now
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-[10px] text-muted-foreground h-8 px-2" disabled>
                                                        {status?.last_synced_at ? 'Synced just now' : 'Never synced'}
                                                    </Button>
                                                </div>
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 p-0">
                                                                <Unplug className="size-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Disconnect & Revoke Access</TooltipContent>
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
                                                {integration.comingSoon ? "Coming Soon" : "Configure & Connect"}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
