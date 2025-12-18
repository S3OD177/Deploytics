import { createClient } from "@/utils/supabase/server";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex flex-col gap-8">
            <SettingsForm
                userEmail={user?.email || "Not signed in"}
                userPlan="Free" // Placeholder - implement plan fetching if billing system exists
            />
        </div>
    );
}
