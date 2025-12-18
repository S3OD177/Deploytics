
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileJson, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ComplianceManager({ projectId }: { projectId: string }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const { data, error } = await supabase.functions.invoke('gdpr-export', {
                body: { projectId }
            });

            if (error) throw error;

            // Trigger download
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `deploytics-export-${projectId}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Export downloaded successfully");
        } catch (err: any) {
            console.error("Export failed", err);
            toast.error("Failed to export data: " + err.message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-indigo-500" />
                    Data Portability (GDPR)
                </CardTitle>
                <CardDescription>
                    Export all your project data in machine-readable JSON format.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div className="space-y-1">
                        <p className="font-medium text-sm">Full Data Archive</p>
                        <p className="text-xs text-muted-foreground">Includes deployments, settings, and logs.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Export JSON
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
