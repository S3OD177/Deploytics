"use client";

import { useState, useTransition } from "react";
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
import { useRouter } from "next/navigation";

export function NewProjectDialog({
    canCreate,
    maxProjects,
    currentProjects
}: {
    canCreate: boolean;
    maxProjects: number;
    currentProjects: number;
}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState("");
    const [tier, setTier] = useState("hobby");
    const router = useRouter();

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Please enter a project name");
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, tier }),
                });

                const data = await res.json();

                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.success("Project created!");
                    setOpen(false);
                    setName("");
                    router.refresh();
                }
            } catch (error) {
                toast.error("Failed to create project");
            }
        });
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
                        <Button onClick={() => router.push('/billing')}>
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
                            <div className="space-y-2">
                                <Label htmlFor="tier">Tier</Label>
                                <Select value={tier} onValueChange={setTier}>
                                    <SelectTrigger id="tier">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hobby">Hobby</SelectItem>
                                        <SelectItem value="pro">Pro</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <Button onClick={handleCreate} disabled={isPending}>
                                {isPending ? (
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
