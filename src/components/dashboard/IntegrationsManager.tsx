
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
    'Slack': Icons.Slack,
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
    'Triangle': Icons.Vercel,
    'Github': Icons.GitHub,
    'Supabase': Icons.Supabase,
    'Netlify': Icons.Netlify,
    'Railway': Icons.Railway,
    'Render': Icons.Render,
    'AWS': Icons.AWS,
    'Azure': Icons.Azure,
    'GoogleCloud': Icons.GoogleCloud,
    'Discord': Icons.Discord,
    'Jira': Icons.Jira,
    'Linear': Icons.Linear,
    'Notion': Icons.Notion,
    'Sentry': Icons.Sentry,
    'Datadog': Icons.Datadog,
    'Twilio': Icons.Twilio,
    'CircleCI': Icons.CircleCI,
    'Jenkins': Icons.Jenkins,
    'Grafana': Icons.Grafana,
    'NewRelic': Icons.NewRelic,
    'Asana': Icons.Asana,
    'ClickUp': Icons.ClickUp,
    'Mixpanel': Icons.Mixpanel,
    'Auth0': Icons.Auth0,
    'Snyk': Icons.Snyk,
    'DigitalOcean': Icons.DigitalOcean,
    'Heroku': Icons.Heroku,
    'Fly': Icons.Fly,
    'msteams': Icons.Teams,
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

    const mergedIntegrations = useMemo(() => {
        return integrationDefinitions.map(def => ({
            ...def,
            steps: def.steps || ["Integration instructions coming soon."],
            fetchOptions: def.fetchOptions || [],
            color: def.color || "text-primary",
            bgColor: def.bgColor || "bg-secondary",
            comingSoon: def.status !== 'available',
        })).sort((a, b) => {
            const statusOrder: Record<string, number> = { 'available': 0, 'beta': 1, 'coming_soon': 2 };
            return (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
        });
    }, []);

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

    // Sub-component for Integration Card to avoid repetition and JSX mess
    const IntegrationCard = ({ integration }: { integration: any }) => {
        const status = getIntegrationStatus(integration.id);
        const isConnected = status?.status === 'connected';
        const isExpanded = expandedId === integration.id;
        const IconComponent = IconMap[integration.icon] || Cloud;
        const currentScopes = selectedScopes[integration.id] || integration.fetchOptions?.filter((o: any) => o.default).map((o: any) => o.id) || [];

        return (
            <Card
                key={integration.id}
                className={cn(
                    "relative overflow-hidden transition-all duration-300 border-border/50 bg-card/50 hover:bg-card hover:border-border",
                    isExpanded && "ring-1 ring-primary border-primary/50 shadow-lg scale-[1.01]",
                    integration.comingSoon && "opacity-80"
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
                            <div className={cn(
                                "p-2.5 rounded-xl border transition-colors duration-300",
                                integration.bgColor || "bg-secondary",
                                isExpanded ? "border-primary/20" : "border-border/50"
                            )}>
                                <IconComponent className={cn("size-6", integration.color || "text-primary")} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                                    {integration.status === 'beta' && (
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 bg-amber-500/10 text-amber-500 border-amber-500/20">BETA</Badge>
                                    )}
                                </div>
                                <CardDescription className="text-xs line-clamp-1">{integration.description}</CardDescription>
                            </div>
                        </div>
                        {!isConnected && !integration.comingSoon && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "size-8 rounded-full transition-all duration-300",
                                    isExpanded ? "bg-primary/10 text-primary rotate-45" : "hover:bg-primary/10 text-muted-foreground"
                                )}
                                onClick={() => handleExpand(isExpanded ? null : integration.id)}
                            >
                                {isExpanded ? <Unplug className="size-4" /> : <RefreshCw className="size-4" />}
                            </Button>
                        )}
                        {isConnected && (
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Active</span>
                                </div>
                                {onDisconnect && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => onDisconnect(integration.id)}
                                    >
                                        <Unplug className="size-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                        {integration.comingSoon && (
                            <Badge variant="secondary" className="text-[10px] font-bold opacity-60">UPCOMING</Badge>
                        )}
                    </div>
                </CardHeader>

                {!isExpanded && (
                    <div className="px-6 pb-6">
                        {isConnected ? (
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                    <Check className="size-3 text-emerald-500" />
                                    <span>Synced {status.last_synced_at ? new Date(status.last_synced_at).toLocaleDateString() : 'Never'}</span>
                                </div>
                                <button
                                    onClick={() => handleExpand(integration.id)}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Manage
                                </button>
                            </div>
                        ) : (
                            <Button
                                variant={integration.comingSoon ? "outline" : "default"}
                                className={cn(
                                    "w-full h-9 text-xs font-bold transition-all duration-300",
                                    !integration.comingSoon && "hover:translate-y-[-1px] hover:shadow-md"
                                )}
                                onClick={() => !integration.comingSoon && hasProjects && handleExpand(integration.id)}
                                disabled={integration.comingSoon || !hasProjects}
                            >
                                {integration.comingSoon ? "Coming Soon" : "Connect"}
                            </Button>
                        )}
                    </div>
                )}

                {isExpanded && !integration.comingSoon && (
                    <div className="px-6 pb-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {integration.fetchOptions && integration.fetchOptions.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                                    Select Data to Sync
                                </span>
                                <div className="grid grid-cols-1 gap-2">
                                    {integration.fetchOptions.map((option: any) => (
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

                        <div className="pt-2 border-t border-border/50 space-y-4">
                            {integration.steps && integration.steps.length > 0 && (
                                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        <Info className="size-3" />
                                        Instructions
                                    </div>
                                    <ol className="text-xs space-y-2 text-muted-foreground leading-relaxed pl-1">
                                        {integration.steps.map((step: string, i: number) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="font-mono text-primary/70 font-bold">{i + 1}.</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            <div className="space-y-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                                    {integration.id === 'vercel' && connectionStep === 'select_project'
                                        ? "Step 3: Select Project"
                                        : "Step 2: Enter Token"
                                    }
                                </span>

                                {integration.id === 'vercel' && connectionStep === 'select_project' ? (
                                    <Select
                                        value={selectedVercelProject}
                                        onValueChange={setSelectedVercelProject}
                                    >
                                        <SelectTrigger className="w-full h-9">
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
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
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

                <div className="order-1 md:order-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="flex p-1 bg-muted/50 border border-border rounded-lg gap-1 min-w-max">
                        {categories.map((cat) => {
                            const count = cat === "All"
                                ? mergedIntegrations.length
                                : mergedIntegrations.filter(i => i.category === cat).length;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap flex items-center gap-2",
                                        activeTab === cat
                                            ? "bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {cat}
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded-full text-[10px]",
                                        activeTab === cat ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground"
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {activeTab === "All" ? (
                <div className="space-y-12">
                    {categories.filter(c => c !== "All").map(cat => {
                        const catIntegrations = filteredIntegrations.filter(i => i.category === cat);
                        if (catIntegrations.length === 0) return null;
                        return (
                            <div key={cat} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">{cat}</h2>
                                    <div className="h-px flex-1 bg-border/40" />
                                </div>
                                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                                    {catIntegrations.map((integration) => (
                                        <IntegrationCard key={integration.id} integration={integration} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredIntegrations.map((integration) => (
                        <IntegrationCard key={integration.id} integration={integration} />
                    ))}
                </div>
            )}

            {filteredIntegrations.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No integrations found matching "{searchQuery}" in {activeTab}.
                </div>
            )}
        </div>
    );
}
