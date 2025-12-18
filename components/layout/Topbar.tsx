"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/layout/MobileNav";
import { usePathname } from "next/navigation";

export function Topbar() {
    const pathname = usePathname();
    const pageName = pathname.split("/").pop() || "Overview";

    return (
        <header className="flex items-center justify-between border-b border-border/50 px-6 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-4 flex-1">
                <MobileNav />
                <div className="hidden md:flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pages</span>
                    <h2 className="text-sm font-semibold text-foreground capitalize">
                        {pageName}
                    </h2>
                </div>

                <div className="flex flex-col min-w-40 h-9 w-full max-w-sm ml-auto md:ml-8">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none">
                            <Search className="size-4 text-muted-foreground" />
                        </div>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:ring-primary/20 focus-visible:bg-background transition-colors rounded-lg font-medium text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 ml-4">
                <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground h-9 w-9">
                    <Bell className="size-5" />
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background"></span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground h-9 w-9">
                    <HelpCircle className="size-5" />
                </Button>
            </div>
        </header>
    );
}
