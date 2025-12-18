import { Bell, Plus } from 'lucide-react'

export default function Alerts() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Alerts</h1>
                    <p className="text-muted-foreground mt-1">
                        Configure deployment notifications
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    New Alert
                </button>
            </div>

            <div className="bg-card border rounded-xl p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts configured</h3>
                <p className="text-muted-foreground mb-4">
                    Set up alerts to get notified about deployment events
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    Create Alert
                </button>
            </div>
        </div>
    )
}
