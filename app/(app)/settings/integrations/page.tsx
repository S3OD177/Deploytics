import { createClient } from "@/utils/supabase/server";
import { IntegrationsManager } from "@/components/dashboard/IntegrationsManager";
import { saveIntegration } from "@/app/actions/integrations";

export default async function IntegrationsPage() {
    const supabase = await createClient();

    // Fetch existing integrations
    const { data: integrations } = await supabase
        .from('integrations')
        .select('id, provider, status, config, last_synced_at');

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
                <p className="text-muted-foreground">
                    Connect your development tools to track deployments and costs.
                </p>
            </div>

            <IntegrationsManager
                integrations={integrations || []}
                onSave={async (provider, token) => {
                    'use server';
                    return saveIntegration(provider, token);
                }}
            />

            <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">
                    More integrations coming soon: AWS, GCP, Azure, DigitalOcean, and more.
                </p>
            </div>
        </div>
    );
}
