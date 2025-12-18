
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, UserPlus, Shield } from "lucide-react";
import { addTeamMember, removeTeamMember } from "@/app/actions/team";
import { toast } from "sonner";

export function TeamList({ project }: { project: any }) {
    const [isPending, startTransition] = useTransition();

    const handleAdd = (formData: FormData) => {
        startTransition(async () => {
            formData.append('projectId', project.id);
            const res = await addTeamMember(null, formData);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success(res?.success || 'Member added');
            }
        });
    };

    const handleRemove = (memberId: string) => {
        const formData = new FormData();
        formData.append('memberId', memberId);
        startTransition(async () => {
            const res = await removeTeamMember(formData);
            if (res?.error) toast.error(res.error);
            else toast.success('Member removed');
        });
    };

    return (
        <Card className="rounded-xl border-border bg-card">
            <CardHeader className="border-b border-border py-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-base">{project.name} Team</CardTitle>
                        <p className="text-xs text-muted-foreground">Manage access for this project</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-6">

                {/* Invite Form */}
                <form action={handleAdd} className="flex gap-3">
                    <Input
                        name="email"
                        placeholder="colleague@example.com"
                        required
                        type="email"
                        className="bg-muted/50 border-border h-9"
                    />
                    <select name="role" className="h-9 rounded-md border border-border bg-muted/50 text-sm px-3 focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <Button size="sm" type="submit" disabled={isPending}>
                        <UserPlus className="size-4 mr-2" />
                        {isPending ? 'Inviting...' : 'Invite'}
                    </Button>
                </form>

                {/* Members List */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Members</h4>

                    {/* Owner (You) - Mocked for now if not in list, usually owner is implicit */}
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-8 rounded bg-primary/20 text-primary">
                                <AvatarFallback className="text-xs font-bold">ME</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">You (Owner)</span>
                            </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            Owner
                        </span>
                    </div>

                    {project.project_members?.map((member: any) => (
                        <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-8 rounded bg-muted text-muted-foreground">
                                    <AvatarFallback>{member.email.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{member.email}</span>
                                    <span className="text-[10px] text-muted-foreground capitalize">{member.role}</span>
                                </div>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemove(member.id)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}

                    {(!project.project_members || project.project_members.length === 0) && (
                        <div className="text-center py-4 text-xs text-muted-foreground italic">
                            No other members yet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
