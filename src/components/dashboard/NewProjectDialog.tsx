

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Github, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function NewProjectDialog({
    canCreate,
    maxProjects,
    currentProjects,
    defaultTier = "hobby"
}: {
    canCreate: boolean;
    maxProjects: number;
    currentProjects: number;
    defaultTier?: string;
}) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Please enter a project name");
            return;
        }

        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('projects').insert({
                name,
                tier: defaultTier,
                user_id: user?.id
            });

            if (error) throw error;

            toast.success("Project created!");
            setOpen(false);
            setName("");
            navigate(0); // Refresh page
        } catch (error: any) {
            toast.error(error.message || "Failed to create project");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-medium shadow-none">
                    <Plus className="mr-2 size-4" />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Track deployments and costs for a new application.
                    </DialogDescription>
                </DialogHeader>

                {!canCreate ? (
                    <div className="py-6 text-center">
                        <div className="size-12 rounded-full bg-amber-500/10 mx-auto mb-4 flex items-center justify-center">
                            <Zap className="size-6 text-amber-500" />
                        </div>
                        <p className="font-medium mb-2">Project limit reached</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            You're using {currentProjects}/{maxProjects} projects.
                        </p>
                        <Button onClick={() => navigate('/billing')}>
                            Upgrade Plan
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    placeholder="my-awesome-app"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-dashed border-border">
                                <Zap className="size-4 text-primary" />
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold leading-none capitalize">
                                        {defaultTier} Tier
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Using your current subscription tier.
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Github className="size-3" />
                                You can link a GitHub repo after creation.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    "Create Project"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
