import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8">
                            {children}
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
