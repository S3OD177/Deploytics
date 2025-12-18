import { createClient } from "@/utils/supabase/server";
import { AlertsConfig } from "@/components/dashboard/AlertsConfig";

export default async function AlertsPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from('projects')
        .select('id, name, status')
        .order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-8">
            <AlertsConfig projects={projects || []} />
        </div>
    );
}
