"use client";

import { useState } from "react";
import { Mail, Hash, Plus, ChevronRight, Info, Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Project {
    id: string;
    name: string;
    status?: string;
}

interface AlertsConfigProps {
    projects: Project[];
}

export function AlertsConfig({ projects }: AlertsConfigProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Alert Rules</h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                    Manage how and when you receive notifications for your project deployments.
                    Alerts are currently triggered on build failures.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Projects List */}
                <div className="lg:w-1/3 xl:w-1/4 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col h-fit">
                    <div className="p-5 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Projects</h2>
                        <p className="text-sm text-muted-foreground mt-1">Select a project to manage its alerts.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-border">
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <ProjectItem
                                    key={project.id}
                                    name={project.name}
                                    active={selectedProject?.id === project.id}
                                    onClick={() => setSelectedProject(project)}
                                />
                            ))
                        ) : (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                No projects found. Create a project first.
                            </div>
                        )}
                    </div>
                </div>

                {/* Config Area */}
                <div className="lg:w-2/3 xl:w-3/4 rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
                    {selectedProject ? (
                        <>
                            <div className="p-5 border-b border-border flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Alert Configuration for <span className="text-primary">{selectedProject.name}</span>
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Adjust notification settings for this project.</p>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-foreground">
                                    <Plus className="size-4" />
                                    Add Alert Rule
                                </Button>
                            </div>

                            <div className="p-5 flex flex-col gap-6">
                                {/* Toggle */}
                                <div className="flex items-center justify-between gap-4 py-2">
                                    <div className="flex flex-col">
                                        <h3 className="text-base font-medium text-foreground">Notify on failed deployments</h3>
                                        <p className="text-sm text-muted-foreground">Receive alerts when a deployment fails for this project.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                {/* Channels */}
                                <div className="flex flex-col gap-4 py-2 border-t border-border pt-6">
                                    <h3 className="text-base font-medium text-foreground">Notification Channels</h3>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Mail className="size-4" />
                                            <span className="text-sm font-medium">Email (Enabled)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground opacity-60">
                                            <Hash className="size-4" />
                                            <span className="text-sm font-medium">Slack (Disabled)</span>
                                            <Badge variant="outline" className="bg-white/10 text-[10px] uppercase border-none text-foreground/70">Coming soon</Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">Configure which channels receive alerts. More channels are coming soon.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-10 text-center text-muted-foreground">
                            <BellOff className="size-10 mx-auto mb-4 opacity-50" />
                            <p>Select a project to configure alerts.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 flex gap-3 items-start">
                <Info className="size-5 text-blue-500 shrink-0" />
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">Need more integrations?</p>
                    <p className="text-sm text-muted-foreground">We are actively working on Slack, Discord, and PagerDuty integrations. Check out our public roadmap to vote on what's next.</p>
                </div>
            </div>
        </div>
    );
}

function ProjectItem({ name, active, onClick }: { name: string; active?: boolean; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer border-l-2",
                active ? "border-primary bg-accent/20" : "border-transparent"
            )}
        >
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20")}>
                <span className={cn("text-lg font-bold text-primary")}>{name.charAt(0).toUpperCase()}</span>
            </div>
            <h3 className="text-sm font-medium text-foreground truncate">{name}</h3>
        </div>
    );
}
