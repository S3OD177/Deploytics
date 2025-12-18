import { AlertsConfig } from '@/components/dashboard/AlertsConfig'

export default function Alerts() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Alerts</h1>
                <p className="text-muted-foreground mt-1">
                    Configure deployment notifications and alerts
                </p>
            </div>

            <AlertsConfig />
        </div>
    )
}
