
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Terminal, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LogViewerProps {
    deploymentId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function LogViewer({ deploymentId, isOpen, onClose }: LogViewerProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["logs", deploymentId],
        queryFn: async () => {
            if (!deploymentId) return null;
            const { data, error } = await supabase.functions.invoke('get-deployment-logs', {
                body: { deploymentId }
            });
            if (error) throw error;
            if (data.error) throw new Error(data.error);
            return data.logs || [];
        },
        enabled: !!deploymentId && isOpen,
        retry: false
    });

    const copyLogs = () => {
        if (!data) return;
        const text = data.map((l: any) => l.text).join('\n');
        navigator.clipboard.writeText(text);
        toast.success("Logs copied to clipboard");
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-[80vw] sm:max-w-[800px] p-0 flex flex-col gap-0 border-l border-border/50 bg-zinc-950 text-zinc-100">
                <SheetHeader className="p-4 border-b border-white/10 bg-zinc-900/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal className="size-5 text-blue-400" />
                            <SheetTitle className="text-zinc-100 font-mono">Deployment Logs</SheetTitle>
                        </div>
                        {data && (
                            <Button variant="outline" size="sm" onClick={copyLogs} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300">
                                <Copy className="size-3 mr-2" />
                                Copy
                            </Button>
                        )}
                    </div>
                    <SheetDescription className="text-zinc-500 font-mono text-xs">
                        ID: {deploymentId}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-hidden relative font-mono text-sm">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                            <Loader2 className="size-6 animate-spin mr-2" />
                            Initializing Stream...
                        </div>
                    ) : error ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4 text-center">
                            <AlertCircle className="size-8 mb-2" />
                            <p>Failed to load logs</p>
                            <p className="text-xs text-zinc-500 mt-2">{(error as Error).message}</p>
                        </div>
                    ) : data?.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                            No logs available for this deployment.
                        </div>
                    ) : (
                        <ScrollArea className="h-full p-4">
                            {data?.map((log: any, i: number) => (
                                <div key={i} className="mb-1 break-all whitespace-pre-wrap">
                                    <span className="text-zinc-600 select-none mr-2">
                                        {new Date(log.created || log.date).toLocaleTimeString()}
                                    </span>
                                    <span className={log.type === 'stderr' ? 'text-red-400' : 'text-zinc-300'}>
                                        {log.text || log.message}
                                    </span>
                                </div>
                            ))}
                        </ScrollArea>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
