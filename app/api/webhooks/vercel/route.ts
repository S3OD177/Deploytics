
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const payload = await request.json();

        // Verify signature logic would go here in a real app (x-vercel-signature)

        // For now, accept generic payload mapping to deployment
        // Example Vercel payload: { type: "deployment.created", payload: { deployment: { ... } } }

        const { type, payload: content } = payload;

        if (type === 'deployment.created' || type === 'deployment.succeeded' || type === 'deployment.error') {
            const deployment = content.deployment;

            let status = 'queued';
            if (type === 'deployment.succeeded') status = 'success';
            if (type === 'deployment.error') status = 'failed';
            if (type === 'deployment.created') status = 'building';

            // NOTE: In a real world scenario, we need to map Vercel project ID to our internal project ID.
            // We might store Vercel Project ID in our `projects` table or `integrations` config.
            // For this MVP, we will try to find a project with the same name.

            const projectName = deployment.name;
            const { data: project } = await supabase.from('projects').select('id').eq('name', projectName).single();

            if (project) {
                await supabase.from('deployments').insert({
                    project_id: project.id,
                    status: status,
                    commit_message: deployment.meta?.commit_message || 'Manual deploy',
                    commit_hash: deployment.meta?.commit_sha || 'unknown',
                    branch: deployment.meta?.github_commit_ref || 'main',
                    environment: 'production', // simplified
                });
                return NextResponse.json({ status: "processed" });
            }
        }

        return NextResponse.json({ status: "ignored" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
