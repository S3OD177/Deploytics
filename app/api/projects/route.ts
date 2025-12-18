import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const PLAN_LIMITS = {
    free: 3,
    pro: 10,
    enterprise: 25,
};

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, tier } = await request.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Project name is required" }, { status: 400 });
        }

        // Check user's plan and project count
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan, extra_projects')
            .eq('user_id', user.id)
            .single();

        const plan = subscription?.plan || 'free';
        const extraProjects = subscription?.extra_projects || 0;
        const maxProjects = (PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || 3) + extraProjects;

        // Count existing projects
        const { count } = await supabase
            .from('projects')
            .select('id', { count: 'exact', head: true });

        if ((count || 0) >= maxProjects) {
            return NextResponse.json({
                error: `Project limit reached (${count}/${maxProjects}). Upgrade your plan to create more.`
            }, { status: 403 });
        }

        // Create project
        const { data: project, error } = await supabase
            .from('projects')
            .insert({
                name: name.trim(),
                tier: tier || 'hobby',
                status: 'active',
                created_by: user.id,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ project });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: projects, error } = await supabase
            .from('projects')
            .select(`
                id,
                name,
                status,
                tier,
                created_at,
                deployments (
                    id,
                    status,
                    created_at
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ projects });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
