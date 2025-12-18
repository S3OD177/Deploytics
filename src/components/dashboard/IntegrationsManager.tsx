
import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Loader2, Check, ExternalLink, Unplug, Info, RefreshCw, Search,
    Cloud, Triangle, Github, Gitlab, GitBranch, Circle, Settings, Play,
    Activity, AlertTriangle, Eye, Slack, MessageSquare, Hash, Mail, Phone,
    Trello, Zap, CheckSquare, FileText, Calendar, CheckCircle, List, Kanban,
    Flag, GitMerge, TrendingUp, PieChart, BarChart2, Shield, Lock, Key, BarChart,
    ToggleRight, FlaskConical // for Experiment
} from "lucide-react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IntegrationService } from "@/lib/integrations";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { integrationDefinitions, IntegrationDefinition } from "@/lib/integrations-data";

// Detailed configuration for "Real" integrations
const DETAILED_INTEGRATIONS = [
    {
        id: "github",
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
    // Add basic details for coming soon items to ensure they render nicely if expanded
    { id: "netlify", color: "text-teal-400", bgColor: "bg-teal-950" },
    { id: "railway", color: "text-purple-400", bgColor: "bg-purple-950" },
    { id: "render", color: "text-blue-400", bgColor: "bg-blue-950" },
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

const IconMap: Record<string, any> = {
    'Cloud': Cloud,
    'Gitlab': Gitlab,
    'GitBranch': GitBranch,
    'Circle': Circle,
    'Settings': Settings,
    'Play': Play,
    'Activity': Activity,
    'AlertTriangle': AlertTriangle,
    'Eye': Eye,
    'Slack': Slack,
    'MessageSquare': MessageSquare,
    'Hash': Hash,
    'Mail': Mail,
    'Phone': Phone,
    'Trello': Trello,
    'Zap': Zap,
    'CheckSquare': CheckSquare,
    'FileText': FileText,
    'Calendar': Calendar,
    'CheckCircle': CheckCircle,
    'List': List,
    'Kanban': Kanban,
    'Flag': Flag,
    'GitMerge': GitMerge,
    'Experiment': FlaskConical,
    'ToggleRight': ToggleRight,
    'BarChart': BarChart,
    'TrendingUp': TrendingUp,
    'PieChart': PieChart,
    'BarChart2': BarChart2,
    'Shield': Shield,
    'Lock': Lock,
    'Key': Key,
    'Search': Search,
    'Triangle': Icons.Vercel, // Override
    'Github': Icons.GitHub,   // Override
    'Supabase': Icons.Supabase,
    'Netlify': Icons.Netlify,
    'Railway': Icons.Railway,
    'Render': Icons.Render,
};

export function IntegrationsManager({
    integrations,
    onSave,
    onDisconnect,
    hasProjects = true
}: {
    integrations: IntegrationData[];
    onSave: (provider: string, token: string, scopes: string[], metadata?: any) => Promise<{ error?: string }>;
    onDisconnect?: (provider: string) => Promise<{ error?: string }>;
    hasProjects?: boolean;
}) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [tokens, setTokens] = useState<Record<string, string>>({});
    const [selectedScopes, setSelectedScopes] = useState<Record<string, string[]>>({});
    const [isPending, startTransition] = useTransition();

    // Vercel specific state
    const [connectionStep, setConnectionStep] = useState<'input' | 'select_project'>('input');
    const [vercelProjects, setVercelProjects] = useState<{ id: string, name: string }[]>([]);
    const [selectedVercelProject, setSelectedVercelProject] = useState<string>('');
    const [isFetchingProjects, setIsFetchingProjects] = useState(false);

    // Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    // Merge Definitions
    const mergedIntegrations = useMemo(() => {
        return integrationDefinitions.map(def => {
            const detailed = DETAILED_INTEGRATIONS.find(d => d.id === def.id);
            return {
                ...def,
                ...detailed,
                // Ensure defaults for missing details
                steps: detailed?.steps || ["Integration coming soon."],
                fetchOptions: detailed?.fetchOptions || [],
                color: detailed?.color || "text-primary",
                bgColor: detailed?.bgColor || "bg-secondary",
                comingSoon: def.status !== 'available',
            };
        });
    }, []);

    // Unique Categories
    const categories = useMemo(() => ["All", ...Array.from(new Set(integrationDefinitions.map(i => i.category)))], []);

    const filteredIntegrations = mergedIntegrations.filter(integration => {
        const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            integration.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "All" || integration.category === activeTab;
        return matchesSearch && matchesTab;
    });

    const getIntegrationStatus = (providerId: string) => {
        return integrations.find(i => i.provider === providerId);
    };

    const handleExpand = (id: string | null) => {
        setExpandedId(id);
        if (!id || id !== expandedId) {
            setConnectionStep('input');
            setVercelProjects([]);
            setSelectedVercelProject('');
        }
    };

    const handleConnect = async (providerId: string) => {
        const token = tokens[providerId];
        const integrationDef = mergedIntegrations.find(i => i.id === providerId);
        const scopes = selectedScopes[providerId] || integrationDef?.fetchOptions?.filter(o => o.default).map(o => o.id) || [];

        if (!token) {
            toast.error("Please enter an access token");
            return;
        }

        // Vercel 2-step process logic
        if (providerId === 'vercel' && connectionStep === 'input') {
            setIsFetchingProjects(true);
            try {
                const validation = await IntegrationService.validateVercel(token);
                if (!validation.isValid) throw new Error(validation.error || "Invalid Vercel token");

                const projects = await IntegrationService.getVercelProjects(token);
                if (projects.length === 0) throw new Error("No Vercel projects found.");

                setVercelProjects(projects);
                setConnectionStep('select_project');
                if (projects.length > 0) setSelectedVercelProject(projects[0].id);
                toast.success("Token verified. Please select a project.");
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch Vercel projects");
            } finally {
                setIsFetchingProjects(false);
            }
            return;
        }

        startTransition(() => {
            (async () => {
                const metadata = (providerId === 'vercel' && selectedVercelProject)
                    ? { project_id: selectedVercelProject }
                    : {};

                const result = await onSave(providerId, token, scopes, metadata);
                if (result.error) {
                    toast.error(result.error);
                } else {
                    toast.success(`${providerId} connected successfully!`);
                    setTokens(prev => ({ ...prev, [providerId]: '' }));
                    handleExpand(null);
                }
            })();
        });
    };

    const toggleScope = (providerId: string, scopeId: string) => {
        // ... existing logic simplified ...
        setSelectedScopes(prev => {
            const def = mergedIntegrations.find(i => i.id === providerId);
            const current = prev[providerId] || def?.fetchOptions?.filter(o => o.default).map(o => o.id) || [];
            if (current.includes(scopeId)) {
                return { ...prev, [providerId]: current.filter(id => id !== scopeId) };
            } else {
                return { ...prev, [providerId]: [...current, scopeId] };
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Search */}
                <div className="relative w-full md:w-64 order-2 md:order-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search marketplace..."
                        className="pl-9 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Tabs */}
                <div className="order-1 md:order-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex p-1 bg-muted/50 border border-border rounded-lg gap-1 min-w-max">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                                    activeTab === cat
                                        ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredIntegrations.map((integration) => {
                    const status = getIntegrationStatus(integration.id);
                    const isConnected = status?.status === 'connected';
                    const isExpanded = expandedId === integration.id;
                    const IconComponent = IconMap[integration.icon] || Cloud;
                    const currentScopes = selectedScopes[integration.id] || integration.fetchOptions?.filter(o => o.default).map(o => o.id) || [];

                    return (
                        <Card
                            key={integration.id}
                            className={cn(
                                "relative overflow-hidden transition-all duration-300 border-border/50 bg-card/50 hover:bg-card hover:border-border",
                                isExpanded && "ring-1 ring-primary border-primary/50 shadow-lg scale-[1.01]",
                                integration.comingSoon && "opacity-80" // Less faint for volume feel
                            )}
                        >
                            {isConnected && (
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-xl shadow-sm ring-1 ring-inset ring-white/10", integration.bgColor)}>
                                            <IconComponent className={cn("size-6", integration.color)} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2 group">
                                                {integration.name}
                                                {integration.comingSoon && (
                                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 opacity-70">Soon</Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-sm mt-1 line-clamp-2">
                                                {integration.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {isConnected && (
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 h-6">
                                            <Check className="size-3.5 mr-1.5" /> Connected
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 space-y-4">
                                {/* Details Logic */}
                                {!isExpanded && (
                                    <div className="pt-2">
                                        {isConnected ? (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="flex-1 text-xs h-8">
                                                    Manage Config
                                                </Button>
                                                <Button
                                                    size="sm" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/10 p-0"
                                                    onClick={() => {
                                                        if (confirm("Disconnect?")) onDisconnect?.(integration.id);
                                                    }}
                                                >
                                                    <Unplug className="size-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full h-9"
                                                onClick={() => !integration.comingSoon && hasProjects && handleExpand(integration.id)}
                                                disabled={integration.comingSoon || !hasProjects}
                                            >
                                                {integration.comingSoon ? "Coming Soon" : "Connect"}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Expansion Logic (Only showing inputs if expanded and available) */}
                                {isExpanded && !integration.comingSoon && (
                                    <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">

                                        {/* Data Selection */}
                                        {integration.fetchOptions && integration.fetchOptions.length > 0 && (
                                            <div className="space-y-3">
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                                                    Select Data to Sync
                                                </span>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {integration.fetchOptions.map((option) => (
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
                                        )}

                                        {/* Instructions & Inputs */}
                                        <div className="pt-2 border-t border-border/50 space-y-4">
                                            {/* Instructions */}
                                            {integration.steps && integration.steps.length > 0 && (
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
                                            )}

                                            {/* Connection Form */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                        {integration.id === 'vercel' && connectionStep === 'select_project'
                                                            ? "Step 3: Select Project"
                                                            : "Step 2: Enter Token"
                                                        }
                                                    </span>
                                                    {integration.id === 'vercel' && connectionStep === 'select_project' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 text-[10px] px-2"
                                                            onClick={() => setConnectionStep('input')}
                                                        >
                                                            Change Token
                                                        </Button>
                                                    )}
                                                </div>

                                                {integration.id === 'vercel' && connectionStep === 'select_project' ? (
                                                    <Select
                                                        value={selectedVercelProject}
                                                        onValueChange={setSelectedVercelProject}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a Vercel Project" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {vercelProjects.map((p) => (
                                                                <SelectItem key={p.id} value={p.id}>
                                                                    {p.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        type="password"
                                                        placeholder={integration.placeholder}
                                                        value={tokens[integration.id] || ''}
                                                        onChange={(e) => setTokens(prev => ({ ...prev, [integration.id]: e.target.value }))}
                                                        className="h-9 font-mono"
                                                    />
                                                )}

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleConnect(integration.id)}
                                                        disabled={isPending || isFetchingProjects}
                                                    >
                                                        {isPending || isFetchingProjects ? <Loader2 className="size-4 animate-spin" /> :
                                                            (integration.id === 'vercel' && connectionStep === 'input' ? "Verify Token" : "Connect Integration")
                                                        }
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleExpand(null)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredIntegrations.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No integrations found matching "{searchQuery}" in {activeTab}.
                </div>
            )}
        </div>
    );
}
