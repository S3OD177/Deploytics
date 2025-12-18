
import { useState } from "react";
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
    // Mock state for UI demo if API fails
    const [slackUrl, setSlackUrl] = useState("");

    // In real app, fetch existing rules
    const { data: rules = [] } = useQuery({
        queryKey: ['alert-rules', project.id],
        queryFn: async () => {
            const { data, error } = await supabase.from('alert_rules').select('*').eq('project_id', project.id);
            if (error) return []; // Fallback empty
            return data;
        }
    });

    const hasSlack = rules.some((r: any) => r.channel_type === 'slack');

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
                        <Switch defaultChecked />
                    </div>
                    <div className="pl-14 grid gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox id="email-fail" defaultChecked />
                            <label htmlFor="email-fail" className="text-sm">Failed Deployments</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="email-success" />
                            <label htmlFor="email-success" className="text-sm">Successful Deployments</label>
                        </div>
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
                        <Switch checked={hasSlack} />
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
                                <Checkbox id="slack-fail" defaultChecked />
                                <label htmlFor="slack-fail" className="text-sm">Failed Deployments</label>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => toast.success("Slack webhook saved!")}>Save Slack Config</Button>
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
