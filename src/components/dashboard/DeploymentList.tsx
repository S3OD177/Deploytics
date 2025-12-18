
import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Search, Filter, AlertCircle, CheckCircle2, GitBranch, Terminal, FileText, Loader2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns";
import { LogViewer } from "./LogViewer";

interface Deployment {
    id: string
    status: 'success' | 'failed' | 'building'
    commit_message: string
    commit_hash: string | null
    branch: string | null
    created_at: string
    environment: string
    resolved_at: string | null
    duration_seconds?: number
    cost?: number
}

interface DeploymentListProps {
    deployments: Deployment[]
    projectId: string
    onResolve: (id: string) => void
    isResolving: boolean
}

export function DeploymentList({ deployments, projectId, onResolve, isResolving }: DeploymentListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [envFilter, setEnvFilter] = useState("all");
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    const filteredDeployments = deployments.filter(d => {
        // Text search
        const matchText = search.toLowerCase() === '' ||
            d.commit_message?.toLowerCase().includes(search.toLowerCase()) ||
            d.branch?.toLowerCase().includes(search.toLowerCase()) ||
            d.commit_hash?.toLowerCase().includes(search.toLowerCase());

        // Status Filter
        const matchStatus = statusFilter === 'all' || d.status === statusFilter;

        // Environment Filter
        const matchEnv = envFilter === 'all' || (d.environment || 'production') === envFilter;

        return matchText && matchStatus && matchEnv;
    });

    // Get unique environments for filter
    const environments = Array.from(new Set(deployments.map(d => d.environment || 'production')))

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search commits, branches..."
                        className="pl-9 bg-background/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] bg-background">
                            <div className="flex items-center gap-2">
                                <Filter className="h-3.5 w-3.5 opacity-70" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="building">Building</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={envFilter} onValueChange={setEnvFilter}>
                        <SelectTrigger className="w-[140px] bg-background">
                            <SelectValue placeholder="Environment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Envs</SelectItem>
                            {environments.map(env => (
                                <SelectItem key={env} value={env}>{env.charAt(0).toUpperCase() + env.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Deployments List */}
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <p className="text-sm font-medium text-muted-foreground">
                        Showing {filteredDeployments.length} of {deployments.length} deployments
                    </p>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3 p-4">
                        {filteredDeployments.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                                <div className="bg-muted p-4 rounded-full">
                                    <Search className="size-6 opacity-40" />
                                </div>
                                <p className="font-medium">No deployments found</p>
                                <p className="text-sm">Try adjusting your filters</p>
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSearch('')
                                        setStatusFilter('all')
                                        setEnvFilter('all')
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        ) : (
                            filteredDeployments.map((deployment) => (
                                <div key={deployment.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-all group animate-in fade-in duration-300 border rounded-lg bg-card/50 mb-2">
                                    {/* Status Icon */}
                                    <div className={cn(
                                        "p-3 rounded-full shrink-0 flex items-center justify-center transition-colors",
                                        deployment.status === 'success'
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : deployment.status === 'failed'
                                                ? 'bg-red-500/10 text-red-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                    )}>
                                        {deployment.status === 'success' ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : deployment.status === 'failed' ? (
                                            <XCircle className="h-5 w-5" />
                                        ) : (
                                            <Clock className="h-5 w-5 animate-pulse" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-sm truncate max-w-[300px]" title={deployment.commit_message}>
                                                {deployment.commit_message || 'No commit message'}
                                            </p>
                                            {deployment.status === 'failed' && (
                                                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Failed</Badge>
                                            )}
                                            {deployment.resolved_at && (
                                                <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-emerald-500/5 text-emerald-600 border-emerald-200">
                                                    Resolved
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
                                                <span className="opacity-70">#</span>
                                                <span className="font-mono">{deployment.commit_hash?.substring(0, 7) || 'HEAD'}</span>
                                            </div>
                                            <span className="text-muted-foreground/30">|</span>
                                            <span className="flex items-center gap-1">
                                                <span className={cn(
                                                    "size-2 rounded-full",
                                                    (deployment.environment || 'production') === 'production' ? "bg-purple-500" : "bg-blue-500"
                                                )} />
                                                <span className="capitalize font-medium">{deployment.environment || 'production'}</span>
                                            </span>
                                            <span className="text-muted-foreground/30">|</span>
                                            <span className="flex items-center gap-1">
                                                <GitBranch className="size-3" />
                                                {deployment.branch || 'main'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions & Time */}
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 mt-2 sm:mt-0 ml-auto sm:ml-0 w-full sm:w-auto justify-between sm:justify-center">
                                        <div className="text-right">
                                            <p className="text-xs font-medium">{new Date(deployment.created_at).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-muted-foreground">{new Date(deployment.created_at).toLocaleTimeString()}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Cost Display */}
                                            {deployment.cost !== undefined && deployment.cost > 0 && (
                                                <div className="hidden sm:flex items-center text-[10px] font-mono text-green-500 bg-green-500/5 px-2 py-1 rounded">
                                                    ${deployment.cost.toFixed(4)}
                                                </div>
                                            )}

                                            {(deployment.status === 'failed' || deployment.status === 'building') && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                                    onClick={() => setSelectedLogId(deployment.id)}
                                                >
                                                    <FileText className="h-3.5 w-3.5 mr-1" /> Logs
                                                </Button>
                                            )}
                                            {deployment.status === 'failed' && !deployment.resolved_at && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                                    onClick={() => onResolve(deployment.id)}
                                                    disabled={isResolving}
                                                >
                                                    Mark Resolved
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            <LogViewer
                deploymentId={selectedLogId}
                isOpen={!!selectedLogId}
                onClose={() => setSelectedLogId(null)}
            />
        </div>
    )
}
