
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface AuditLog {
    id: string;
    action: string;
    resource: string;
    metadata: any;
    created_at: string;
    actor_id: string | null;
}

interface AuditLogViewerProps {
    projectId: string;
}

export function AuditLogViewer({ projectId }: AuditLogViewerProps) {
    // 1. Fetch Project to get Org ID
    const { data: project } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const { data } = await supabase.from('projects').select('organization_id').eq('id', projectId).single();
            return data;
        },
        enabled: !!projectId
    });

    const orgId = project?.organization_id;

    // 2. Fetch Logs
    const { data: logs, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['audit-logs', orgId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .eq('organization_id', orgId)
                .order('created_at', { ascending: false })
                .limit(50);
            if (error) throw error;
            return data as AuditLog[];
        },
        enabled: !!orgId
    });

    return (
        <Card className="h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-500" />
                        Audit Logs
                    </CardTitle>
                    <CardDescription>
                        Immutable record of platform activities.
                    </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isRefetching}>
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : logs && logs.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Action</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium text-xs font-mono">{log.action}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground">{log.resource}</span>
                                                {log.metadata && (
                                                    <pre className="text-[10px] text-muted-foreground bg-muted p-1 rounded max-w-[200px] overflow-hidden truncate">
                                                        {JSON.stringify(log.metadata)}
                                                    </pre>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                ) : (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No audit logs recorded yet.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
