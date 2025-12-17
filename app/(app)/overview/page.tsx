export default function OverviewPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder for stats */}
                <div className="p-6 bg-card rounded-xl border shadow-sm h-32 flex items-center justify-center text-muted-foreground border-dashed">
                    Stats Placeholder
                </div>
                <div className="p-6 bg-card rounded-xl border shadow-sm h-32 flex items-center justify-center text-muted-foreground border-dashed">
                    Stats Placeholder
                </div>
                <div className="p-6 bg-card rounded-xl border shadow-sm h-32 flex items-center justify-center text-muted-foreground border-dashed">
                    Stats Placeholder
                </div>
            </div>
        </div>
    );
}
