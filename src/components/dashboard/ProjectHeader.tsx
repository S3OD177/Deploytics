
import { Link } from "react-router-dom";
import { ChevronRight, ExternalLink, PenLine, Rocket, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProjectHeaderProps {
    project: any;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const isHealthy = project.status === 'active';
    // Simplified logic, assume if active it's healthy.

    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link to="/overview" className="hover:text-foreground">Projects</Link>
                        <span className="text-muted-foreground/50">/</span>
                        <span className="text-foreground font-medium">{project.name}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <h2 className="text-3xl font-bold text-foreground tracking-tight">
                            {project.name}
                        </h2>
                        <div className="flex gap-2">
                            {isHealthy && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                    Healthy
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 capitalize">
                                <Rocket className="size-3.5" />
                                {project.tier}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm max-w-2xl">
                    {project.description || "No description provided."}
                </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Button variant="outline" className="h-9 gap-2 bg-transparent">
                    <PenLine className="size-4" />
                    Edit Project
                </Button>
                <Button variant="outline" className="h-9 gap-2 bg-transparent">
                    <ExternalLink className="size-4" />
                    Visit Site
                </Button>
            </div>
        </div>
    );
}
