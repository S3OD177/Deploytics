
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Mail, Hash, Plus, Info, Bell, BellOff, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Project {
    id: string;
    name: string;
}

export function AlertsConfig({ projects }: { projects: Project[] }) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Alert Rules</h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                    Manage how and when you receive notifications for your project deployments.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3 xl:w-1/4 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col h-fit">
                    <div className="p-5 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Projects</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-border">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={cn(
                                    "flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer border-l-2",
                                    selectedProject?.id === project.id ? "border-primary bg-accent/20" : "border-transparent"
                                )}
                            >
                                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20", selectedProject?.id === project.id ? "text-primary" : "text-muted-foreground")}>
                                    <span className="text-lg font-bold">{project.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <h3 className="text-sm font-medium text-foreground truncate">{project.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-2/3 xl:w-3/4 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
                    {selectedProject ? (
                        <ProjectAlerts project={selectedProject} />
                    ) : (
                        <div className="p-10 text-center text-muted-foreground">
                            <BellOff className="size-10 mx-auto mb-4 opacity-50" />
                            <p>Select a project to configure alerts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProjectAlerts({ project }: { project: Project }) {
    const queryClient = useQueryClient();
    const [slackUrl, setSlackUrl] = useState("");
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [emailFailedEnabled, setEmailFailedEnabled] = useState(true);
    const [emailSuccessEnabled, setEmailSuccessEnabled] = useState(false);
    const [slackEnabled, setSlackEnabled] = useState(false);
    const [slackFailedEnabled, setSlackFailedEnabled] = useState(true);

    // Fetch existing rules for this project
    const { data: rules = [], isLoading } = useQuery({
        queryKey: ['alert-rules', project.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('alert_rules')
                .select('*')
                .eq('project_id', project.id);
            if (error) throw error;
            return data || [];
        }
    });

    // Sync local state with fetched rules
    useEffect(() => {
        const emailRule = rules.find((r: any) => r.channel_type === 'email');
        const slackRule = rules.find((r: any) => r.channel_type === 'slack');

        if (emailRule) {
            setEmailEnabled(emailRule.enabled);
            setEmailFailedEnabled(emailRule.events?.includes('deployment.failed') ?? true);
            setEmailSuccessEnabled(emailRule.events?.includes('deployment.success') ?? false);
        }
        if (slackRule) {
            setSlackEnabled(slackRule.enabled);
            setSlackUrl(slackRule.config?.webhook_url || '');
            setSlackFailedEnabled(slackRule.events?.includes('deployment.failed') ?? true);
        }
    }, [rules]);

    // Mutation to upsert alert rules
    const upsertRuleMutation = useMutation({
        mutationFn: async ({ channelType, enabled, config, events }: { channelType: string, enabled: boolean, config: Record<string, any>, events: string[] }) => {
            const existing = rules.find((r: any) => r.channel_type === channelType);

            if (existing) {
                const { error } = await supabase
                    .from('alert_rules')
                    .update({ enabled, config, events, updated_at: new Date().toISOString() })
                    .eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('alert_rules')
                    .insert({ project_id: project.id, channel_type: channelType, enabled, config, events });
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alert-rules', project.id] });
            toast.success("Alert rule saved!");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to save alert rule");
        }
    });

    const handleSaveEmail = () => {
        const events: string[] = [];
        if (emailFailedEnabled) events.push('deployment.failed');
        if (emailSuccessEnabled) events.push('deployment.success');
        upsertRuleMutation.mutate({ channelType: 'email', enabled: emailEnabled, config: {}, events });
    };

    const handleSaveSlack = () => {
        if (!slackUrl.startsWith('https://hooks.slack.com/')) {
            toast.error("Please enter a valid Slack webhook URL");
            return;
        }
        const events: string[] = [];
        if (slackFailedEnabled) events.push('deployment.failed');
        upsertRuleMutation.mutate({ channelType: 'slack', enabled: slackEnabled, config: { webhook_url: slackUrl }, events });
    };

    if (isLoading) {
        return <div className="p-10 text-center text-muted-foreground">Loading...</div>;
    }

    return (
        <>
            <div className="p-5 border-b border-border flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Configuration for <span className="text-primary">{project.name}</span>
                    </h2>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-8">
                {/* Email Channel */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                <Mail className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-muted-foreground">Send to your account email.</p>
                            </div>
                        </div>
                        <Switch checked={emailEnabled} onCheckedChange={(v) => setEmailEnabled(v)} />
                    </div>
                    <div className="pl-14 grid gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox id="email-fail" checked={emailFailedEnabled} onCheckedChange={(v) => setEmailFailedEnabled(!!v)} />
                            <label htmlFor="email-fail" className="text-sm">Failed Deployments</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="email-success" checked={emailSuccessEnabled} onCheckedChange={(v) => setEmailSuccessEnabled(!!v)} />
                            <label htmlFor="email-success" className="text-sm">Successful Deployments</label>
                        </div>
                        <Button size="sm" onClick={handleSaveEmail} disabled={upsertRuleMutation.isPending}>Save Email Config</Button>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Slack Channel */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                                <Hash className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Slack Webhook</h3>
                                <p className="text-sm text-muted-foreground">Post to a Slack channel.</p>
                            </div>
                        </div>
                        <Switch checked={slackEnabled} onCheckedChange={(v) => setSlackEnabled(v)} />
                    </div>

                    <div className="pl-14 space-y-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-medium uppercase text-muted-foreground">Webhook URL</label>
                            <Input
                                placeholder="https://hooks.slack.com/services/..."
                                value={slackUrl}
                                onChange={(e) => setSlackUrl(e.target.value)}
                                className="font-mono text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="slack-fail" checked={slackFailedEnabled} onCheckedChange={(v) => setSlackFailedEnabled(!!v)} />
                                <label htmlFor="slack-fail" className="text-sm">Failed Deployments</label>
                            </div>
                        </div>
                        <Button size="sm" onClick={handleSaveSlack} disabled={upsertRuleMutation.isPending}>Save Slack Config</Button>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Discord */}
                <div className="flex flex-col gap-4 opacity-75">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                                <MessageSquare className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Discord Webhook</h3>
                                <p className="text-sm text-muted-foreground">Post to a Discord server.</p>
                            </div>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                    </div>
                </div>
            </div>
        </>
    );
}

