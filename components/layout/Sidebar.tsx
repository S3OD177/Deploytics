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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <aside className={cn("hidden lg:flex flex-col w-72 h-full bg-sidebar border-r border-sidebar-border", className)}>
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary/10 rounded-full size-10 flex items-center justify-center text-primary">
                    <Activity className="size-6" />
                </div>
                <h1 className="text-sidebar-foreground text-xl font-bold leading-normal">
                    DevPulse
                </h1>
            </div>

            <nav className="flex flex-col gap-2 px-4 flex-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-6",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            <p className="text-sm font-medium leading-normal">{link.label}</p>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar className="size-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sidebar-foreground text-sm font-bold">
                            Alex Morgan
                        </p>
                        <p className="text-muted-foreground text-xs">Lead Engineer</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
