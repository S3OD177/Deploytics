
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, ShieldAlert, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityScorecard } from "./SecurityScorecard";
import { ComplianceManager } from "./ComplianceManager";
import { SsoSettings } from "./SsoSettings";

interface ProjectSettingsProps {
    project: {
        id: string;
        name: string;
        description: string | null;
        settings?: any;
    };
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || "");
    const [weeklyEmailEnabled, setWeeklyEmailEnabled] = useState(project.settings?.weekly_email_enabled || false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState("");

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Update Project Mutation
    const updateMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from("projects")
                .update({
                    name,
                    description,
                    settings: { ...project.settings, weekly_email_enabled: weeklyEmailEnabled }
                })
                .eq("id", project.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", project.id] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Project updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update project");
        },
    });

    // Delete Project Mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from("projects")
                .delete()
                .eq("id", project.id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Project deleted successfully");
            navigate("/projects");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete project");
        },
    });

    return (

        <div className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security & Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* General Settings */}
                    <Card className="border-border/50 bg-card/50">
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Update your project's identity and metadata.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. My Awesome App"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe what this project does"
                                    className="bg-background/50"
                                />
                            </div>
                            <Button
                                onClick={() => updateMutation.mutate()}
                                disabled={updateMutation.isPending || !name.trim()}
                                className="font-bold"
                            >
                                {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Email Reports */}
                    <Card className="border-border/50 bg-card/50">
                        <CardHeader>
                            <CardTitle>Email Reports</CardTitle>
                            <CardDescription>
                                Configure scheduled email reports for this project.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Weekly Summary</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive a weekly email summary of deployment activity and stats.
                                    </p>
                                </div>
                                <Switch
                                    checked={weeklyEmailEnabled}
                                    onCheckedChange={setWeeklyEmailEnabled}
                                    disabled={updateMutation.isPending}
                                />
                            </div>
                            <div className="flex justify-start">
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-500 text-sm">
                                    <Info className="size-4" />
                                    <span>Reports are sent every Monday morning (UTC).</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => updateMutation.mutate()}
                                disabled={updateMutation.isPending}
                                className="font-bold"
                            >
                                {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card >

                    {/* Danger Zone */}
                    < Card className="border-red-500/20 bg-red-500/5" >
                        <CardHeader>
                            <CardTitle className="text-red-500 flex items-center gap-2 text-lg">
                                <ShieldAlert className="size-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription className="text-red-500/80">
                                Irreversible actions that cannot be undone.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                <div>
                                    <p className="font-bold text-red-600 dark:text-red-400">Delete this project</p>
                                    <p className="text-sm text-red-500/70">Once deleted, all deployments and data will be lost.</p>
                                </div>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="font-bold gap-2">
                                            <Trash2 className="size-4" />
                                            Delete Project
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete the
                                                <span className="font-bold text-foreground mx-1">"{project.name}"</span>
                                                project and remove all associated data.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmName">Type <span className="font-mono text-xs bg-muted px-1 rounded">{project.name}</span> to confirm</Label>
                                                <Input
                                                    id="confirmName"
                                                    value={deleteConfirmName}
                                                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                                                    placeholder={project.name}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsDeleteDialogOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                disabled={deleteConfirmName !== project.name || deleteMutation.isPending}
                                                onClick={() => deleteMutation.mutate()}
                                                className="font-bold"
                                            >
                                                {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                I understand, delete this project
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card >
                </TabsContent>

                <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid gap-6 md:grid-cols-2">
                        <SecurityScorecard />
                        <SsoSettings />
                    </div>
                    <ComplianceManager projectId={project.id} />
                </TabsContent>
            </Tabs>
        </div >
    );
}
