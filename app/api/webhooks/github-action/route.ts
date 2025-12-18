import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const signature = request.headers.get("x-hub-signature-256");
        const bodyText = await request.text();

        // 1. Verify GitHub Signature (optional but recommended)
        // If you set a secret in GitHub, use it here. For now, we'll proceed for MVP.
        // const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

        const payload = JSON.parse(bodyText);
        const supabase = createAdminClient();

        // We are interested in "push" events that trigger a Vercel deploy
        // Or "workflow_run" if we use the GitHub Action approach

        // Secret check removed for easier setup
        // const authHeader = request.headers.get("authorization");
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { commit_message, commit_hash, branch, status, project_name } = payload;

        // Find project
        const { data: project } = await supabase
            .from("projects")
            .select("id")
            .ilike("name", project_name || "Deploytics") // Fallback for MVP
            .single();

        if (project) {
            await supabase.from("deployments").insert({
                project_id: project.id,
                status: status || "success",
                commit_message: commit_message || "Manual deploy",
                commit_hash: commit_hash || "unknown",
                branch: branch || "main",
                environment: "production",
            });
            return NextResponse.json({ status: "recorded" });
        }

        return NextResponse.json({ status: "project_not_found" });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
