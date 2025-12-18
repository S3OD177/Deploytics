'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveIntegration(provider: string, token: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    // Verify token with provider API
    let isValid = false;

    switch (provider) {
        case 'github':
            const ghRes = await fetch('https://api.github.com/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            isValid = ghRes.ok;
            break;

        case 'vercel':
            const vercelRes = await fetch('https://api.vercel.com/v2/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            isValid = vercelRes.ok;
            break;

        case 'supabase':
            // Supabase management API validation
            const sbRes = await fetch('https://api.supabase.com/v1/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            isValid = sbRes.ok;
            break;

        default:
            isValid = true; // Allow for future integrations
    }

    if (!isValid) {
        return { error: "Invalid token. Please check and try again." };
    }

    // Get first project for user (or create one if needed for MVP)
    const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .limit(1);

    const projectId = projects?.[0]?.id;

    if (!projectId) {
        return { error: "No project found. Create a project first." };
    }

    // Upsert integration
    const { error } = await supabase
        .from('integrations')
        .upsert({
            project_id: projectId,
            provider: provider,
            status: 'connected',
            config: { access_token: token },
            last_synced_at: new Date().toISOString(),
        }, {
            onConflict: 'project_id,provider'
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/settings/integrations');
    return { success: true };
}

export async function disconnectIntegration(provider: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('provider', provider);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/settings/integrations');
    return { success: true };
}
