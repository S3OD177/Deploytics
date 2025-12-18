"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderOpen,
    Bell,
    CreditCard,
    Settings,
    Activity,
    LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarLinks = [
    { href: "/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/billing", label: "Billing", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("hidden lg:flex flex-col w-72 h-full bg-card border-r border-border", className)}>
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary/10 rounded-xl size-10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                    <Activity className="size-6" />
                </div>
                <h1 className="text-foreground text-xl font-bold tracking-tight">
                    DevPulse
                </h1>
            </div>

            <nav className="flex flex-col gap-1 px-4 flex-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                        <Link key={link.href} href={link.href} passHref>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 h-10 font-medium",
                                    isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="size-4" />
                                {link.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 px-6 mb-2">
                <Carduser />
            </div>
        </aside>
    );
}

function Carduser() {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group">
            <Avatar className="size-9 border border-border">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    Alex Morgan
                </p>
                <p className="text-xs text-muted-foreground truncate">alex@devpulse.com</p>
            </div>
            <LogOut className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
        </div>
    )
}
