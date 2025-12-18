
import { createClient } from "@/utils/supabase/server";
import { TeamList } from "@/components/dashboard/TeamList";

export default async function TeamSettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch projects owned by user with their members
    const { data: projects } = await supabase
        .from('projects')
        .select(`
            id,
            name,
            project_members (
                id,
                email,
                role
            )
        `)
        .eq('created_by', user?.id) // Only manage own projects for simplicity
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
                <p className="text-muted-foreground">
                    Invite team members to collaborate on your projects.
                </p>
            </div>

            <div className="grid gap-6">
                {projects?.map((project) => (
                    <TeamList key={project.id} project={project} />
                ))}

                {(!projects || projects.length === 0) && (
                    <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground">
                        You don't have any projects to manage yet.
                    </div>
                )}
            </div>
        </div>
    );
}
