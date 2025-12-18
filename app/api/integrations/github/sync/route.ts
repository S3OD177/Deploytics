
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const GITHUB_API_URL = "https://api.github.com";

export async function POST(request: Request) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project_id } = await request.json();

    if (!project_id) {
        return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
    }

    // 1. Get Integration Token
    const { data: integration, error: intError } = await supabase
        .from('integrations')
        .select('config')
        .eq('project_id', project_id)
        .eq('provider', 'github')
        .single();

    if (intError || !integration) {
        return NextResponse.json({ error: "GitHub not connected for this project" }, { status: 400 });
    }

    const token = integration.config?.token;
    if (!token) {
        return NextResponse.json({ error: "Invalid configuration" }, { status: 500 });
    }

    // 2. Poll GitHub for Commits (Mocking repo selection for now - ideally stored in config)
    // For MVP we can list user repos or assume a repo is selected in config. 
    // Let's assume we want to list repos to let user select (different endpoint),
    // OR this endpoint syncs data for a SELECTED repo.
    // Let's implement a simple "List Repos" check to verify token validity.

    try {
        const res = await fetch(`${GITHUB_API_URL}/user/repos?sort=updated&per_page=5`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "GitHub API Error" }, { status: res.status });
        }

        const repos = await res.json();

        // 3. For MVP, if we found repos, let's fetch COMMITS for the first repo found 
        // and simulate syncing them as deployments for this project.
        if (repos.length > 0) {
            const repo = repos[0];
            const commitsRes = await fetch(`${GITHUB_API_URL}/repos/${repo.full_name}/commits?per_page=5`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (commitsRes.ok) {
                const commits = await commitsRes.json();

                // Insert into deployments
                for (const commit of commits) {
                    // Check if commit hash already exists to avoid duplicates
                    const { data: existing } = await supabase
                        .from('deployments')
                        .select('id')
                        .eq('commit_hash', commit.sha)
                        .eq('project_id', project_id)
                        .single();

                    if (!existing) {
                        await supabase.from('deployments').insert({
                            project_id: project_id,
                            status: Math.random() > 0.3 ? 'success' : 'failed', // Simulate status
                            commit_message: commit.commit.message,
                            commit_hash: commit.sha,
                            branch: 'main',
                            environment: 'production'
                        });
                    }
                }
            }
        }

        // Update sync status
        await supabase.from('integrations')
            .update({ last_synced_at: new Date().toISOString(), status: 'connected' })
            .eq('project_id', project_id)
            .eq('provider', 'github');

        return NextResponse.json({ status: "synced", repos_found: repos.length });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
