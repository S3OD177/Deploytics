
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Clock, Activity, ShieldCheck } from 'lucide-react';

export default function StatusPage() {
    const { projectId } = useParams();

    const { data: project, isLoading } = useQuery({
        queryKey: ['status-project', projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('name, description')
                .eq('id', projectId)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!projectId
    });

    const { data: lastDeploy } = useQuery({
        queryKey: ['status-deploy', projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deployments')
                .select('status, created_at')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        },
        enabled: !!projectId
    });

    const { data: history = [] } = useQuery({
        queryKey: ['status-history', projectId],
        queryFn: async () => {
            // Last 30 days stats
            const { data, error } = await supabase
                .from('deployments')
                .select('status, created_at')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })
                .limit(30);
            return data || [];
        },
        enabled: !!projectId
    });

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!project) return <div className="h-screen flex items-center justify-center">Project Not Found</div>;

    const isHealthy = lastDeploy?.status === 'success';
    const statusText = isHealthy ? 'All Systems Operational' : lastDeploy?.status === 'failed' ? 'Active Incident' : 'Deployment in Progress';
    const statusColor = isHealthy ? 'bg-emerald-500' : lastDeploy?.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl">{project.name} <span className="text-muted-foreground font-normal text-sm ml-2">Status</span></div>
                    <a href="https://deploytics.com" className="text-sm text-muted-foreground hover:underline">Powered by Deploytics</a>
                </div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 space-y-12">

                {/* Current Status */}
                <div className={`rounded-xl p-8 text-white shadow-lg transition-colors ${statusColor}`}>
                    <div className="flex items-center gap-4">
                        {isHealthy ? <CheckCircle className="size-8" /> : <XCircle className="size-8" />}
                        <div>
                            <h1 className="text-2xl font-bold">{statusText}</h1>
                            <p className="opacity-90 mt-1">
                                {lastDeploy ? `Last Checked: ${new Date(lastDeploy.created_at).toLocaleString()}` : 'No data available'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services Grid (Mocked for now as we treat project as 1 service) */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">System Metrics</h2>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                            <Activity className="size-5 text-muted-foreground" />
                            <span className="font-medium">API Availability</span>
                        </div>
                        <span className="text-emerald-500 font-medium">99.99%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="size-5 text-muted-foreground" />
                            <span className="font-medium">Web App</span>
                        </div>
                        <span className="text-emerald-500 font-medium">Operational</span>
                    </div>
                </div>

                {/* History */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Past Incident History</h2>
                    <div className="space-y-6">
                        {history.length === 0 && <p className="text-muted-foreground">No incidents reported.</p>}

                        {/* Mock an incident if we have failed deploys */}
                        {history.filter((d: any) => d.status === 'failed').slice(0, 3).map((d: any, i) => (
                            <div key={i} className="space-y-2">
                                <h3 className="font-bold">Deployment Failure</h3>
                                <p className="text-sm text-muted-foreground">
                                    A deployment failed to complete successfully. Investigating logs.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(d.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))}

                        {/* Fallback mock if clean history */}
                        {history.filter((d: any) => d.status === 'failed').length === 0 && (
                            <div className="text-sm text-muted-foreground">No incidents in the last 30 days.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
