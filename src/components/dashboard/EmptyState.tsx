import { FolderOpen, Zap, Bell, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    type: "projects" | "deployments" | "alerts" | "integrations";
    className?: string;
}

const EMPTY_STATES = {
    projects: {
        icon: FolderOpen,
        title: "No projects yet",
        description: "Create your first project to start tracking deployments.",
        action: "Create Project",
        href: "/overview",
    },
    deployments: {
        icon: Zap,
        title: "No deployments",
        description: "Connect an integration to see your deployments here.",
        action: "Connect Integration",
        href: "/settings/integrations",
    },
    alerts: {
        icon: Bell,
        title: "No alerts configured",
        description: "Set up alerts to get notified when deployments fail.",
        action: "Configure Alerts",
        href: "/alerts",
    },
    integrations: {
        icon: BarChart3,
        title: "No integrations connected",
        description: "Connect GitHub, Vercel, or Supabase to track your deployments.",
        action: "Connect Now",
        href: "/settings/integrations",
    },
};

export function EmptyState({ type, className }: EmptyStateProps) {
    const state = EMPTY_STATES[type];
    const Icon = state.icon;

    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl border border-dashed border-muted-foreground/20 bg-muted/10",
            className
        )}>
            <div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Icon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{state.title}</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
                {state.description}
            </p>
            <Link to={state.href}>
                <Button>{state.action}</Button>
            </Link>
        </div>
    );
}
