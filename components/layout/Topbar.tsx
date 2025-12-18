"use client";

import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MobileNav } from "@/components/layout/MobileNav";

export function Topbar() {
    return (
        <header className="flex items-center justify-between border-b border-border px-6 lg:px-10 py-4 bg-background z-10 sticky top-0">
            <div className="flex items-center gap-4 lg:gap-8 flex-1">
                <MobileNav />
                <h2 className="hidden md:block text-foreground text-lg font-bold leading-tight tracking-tight">
                    Dashboard
                </h2>
                <div className="flex flex-col min-w-40 h-10 w-full max-w-sm ml-auto md:ml-0">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none">
                            <Search className="size-5 text-muted-foreground" />
                        </div>
                        <Input
                            type="search"
                            placeholder="Search projects, logs, or commits..."
                            className="pl-10 bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:bg-background transition-colors"
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-4 ml-4">
                <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
                    <Bell className="size-6" />
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-background"></span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                    <HelpCircle className="size-6" />
                </Button>
            </div>
        </header>
    );
}
