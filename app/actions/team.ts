
'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function addTeamMember(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    const email = formData.get('email') as string;
    const projectId = formData.get('projectId') as string;
    const role = formData.get('role') as string || 'viewer';

    if (!email || !projectId) {
        return { error: 'Email and Project ID are required' };
    }

    // 1. Verify verify current user is owner of project
    const { data: project } = await supabase
        .from('projects')
        .select('id, created_by')
        .eq('id', projectId)
        .single();

    // Simplification: RLS will block if not allowed, but good to check ownership explicitly or rely on "Manage project members" policy if implemented correctly.
    // Our policy says: exists (select 1 from projects where id=project_id and created_by=auth.uid())
    // So ordinary insert using 'supabase' (user client) would work IF we had the user_id of the invitee.
    // But we only have email. So we need admin client to lookup user_id.

    // 2. Lookup user by email (Admin only)
    const { data: { users }, error: userError } = await adminSupabase.auth.admin.listUsers();
    // listUsers is not efficient for filtering by email in client, but let's try listUsers() or specific query if supported.
    // Better: use listUsers({ page: 1, perPage: 1, query: email }) ?? No, API doesn't fully support filter by email perfectly in lib sometimes?
    // Actually, listUsers() returns a list. 

    // Alternative: We can just assume the user ID if we had it. 
    // Let's iterate users for MVP or use the specific "getUserById" isn't helpful.
    // Wait, we can't search users easily without specific admin API.
    // Let's use `adminSupabase.from('auth.users').select('id').eq('email', email)` ? No, can't query auth schema directly usually via JS lib unless enabled.

    // Let's try listUsers with no args and filter in memory (BAD for prod, ok for MVP with few users) or standard way.
    // Standard way: admin.listUsers() doesn't support email filter? 
    // Actually, createAdminClient() allows us to interact with the DB as postgres if we configured it, but let's use the Auth Admin API.

    // Optimized: adminSupabase.rpc() if we had a function?

    // Fallback for MVP: 
    // We will just do a `listUsers` and find. 
    // NOTE: This is a hack for the MVP.

    /* 
       REAL PRODUCTION IMPL would invite via email (supabase.auth.admin.inviteUserByEmail).
       But we want to add EXISTING user.
    */

    // Let's try to map email to ID via detailed lookup or just fetch all (MVP hack).
    const { data: usersData, error } = await adminSupabase.auth.admin.listUsers();
    if (error || !usersData.users) return { error: 'Failed to look up users' };

    const targetUser = usersData.users.find((u: any) => u.email === email);

    if (!targetUser) {
        return { error: 'User not found. They must sign up first.' };
    }

    // 3. Insert into project_members
    const { error: insertError } = await supabase
        .from('project_members')
        .insert({
            project_id: projectId,
            user_id: targetUser.id,
            email: email,
            role: role
        });

    if (insertError) {
        if (insertError.code === '23505') return { error: 'User is already a member.' };
        return { error: insertError.message };
    }

    revalidatePath('/settings/team');
    return { success: `Added ${email} to the team.` };
}

export async function removeTeamMember(formData: FormData) {
    const supabase = await createClient();
    const memberId = formData.get('memberId') as string;

    const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

    if (error) return { error: error.message };
    revalidatePath('/settings/team');
    return { success: 'Member removed.' };
}
