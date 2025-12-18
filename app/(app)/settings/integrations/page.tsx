"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function IntegrationsPage() {
    const [ghToken, setGhToken] = useState("");
    const [vercelToken, setVercelToken] = useState("");
    const [loading, setLoading] = useState(false);

    // Note: In a real app, we should check existing integrations status here.

    const handleConnectGithub = async () => {
        if (!ghToken) {
            toast.error("Please enter a Personal Access Token");
            return;
        }
        setLoading(true);
        try {
            const supabase = createClient();

            // Fetch a project to attach to (TEMPORARY logic for MVP)
            const { data: projects } = await supabase.from('projects').select('id').limit(1);
            if (!projects || projects.length === 0) {
                toast.error("No projects found. Create a project first.");
                return;
            }
            const projectId = projects[0].id;

            const { error } = await supabase.from('integrations').upsert({
                project_id: projectId,
                provider: 'github',
                config: { token: ghToken },
                status: 'connected'
            }, { onConflict: 'project_id, provider' });

            if (error) throw error;

            toast.success("GitHub connected successfully!");
            setGhToken("");
        } catch (err: any) {
            toast.error(err.message || "Failed to connect");
        } finally {
            setLoading(false);
        }
    };

    const handleConnectVercel = async () => {
        if (!vercelToken) {
            toast.error("Please enter a Vercel Access Token");
            return;
        }
        setLoading(true);
        try {
            const supabase = createClient();

            // Fetch a project to attach to (TEMPORARY logic for MVP)
            const { data: projects } = await supabase.from('projects').select('id').limit(1);
            if (!projects || projects.length === 0) {
                toast.error("No projects found. Create a project first.");
                return;
            }
            const projectId = projects[0].id;

            const { error } = await supabase.from('integrations').upsert({
                project_id: projectId,
                provider: 'vercel',
                config: { token: vercelToken },
                status: 'connected'
            }, { onConflict: 'project_id, provider' });

            if (error) throw error;

            toast.success("Vercel connected successfully!");
            setVercelToken("");
        } catch (err: any) {
            toast.error(err.message || "Failed to connect");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto pb-20 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Integrations</h1>
                <p className="text-muted-foreground">Manage your connections to external services.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Github className="size-8" />
                        <div>
                            <CardTitle>GitHub</CardTitle>
                            <CardDescription>Connect to GitHub to track commits and deployment statuses.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="gh-token">Personal Access Token</Label>
                        <Input
                            id="gh-token"
                            placeholder="ghp_..."
                            type="password"
                            value={ghToken}
                            onChange={(e) => setGhToken(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Required scopes: <code>repo</code>, <code>read:user</code>.
                        </p>
                    </div>
                    <Button onClick={handleConnectGithub} disabled={loading}>
                        {loading ? "Connecting..." : "Connect GitHub"}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        {/* Vercel Icon Mock */}
                        <svg className="size-8 text-foreground" fill="none" viewBox="0 0 1155 1000" xmlns="http://www.w3.org/2000/svg">
                            <path d="M577.344 0L1154.69 1000H0L577.344 0Z" fill="currentColor"></path>
                        </svg>
                        <div>
                            <CardTitle>Vercel</CardTitle>
                            <CardDescription>Import projects and receive deployment webhooks.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="vercel-token">Access Token</Label>
                        <Input
                            id="vercel-token"
                            placeholder="ey..."
                            type="password"
                            value={vercelToken}
                            onChange={(e) => setVercelToken(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleConnectVercel} disabled={loading}>
                        {loading ? "Connecting..." : "Connect Vercel"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
