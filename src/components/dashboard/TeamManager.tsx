
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Trash2, UserPlus, Clock } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RbacVisualizer } from "./RbacVisualizer";
import { AuditLogViewer } from "./AuditLogViewer";

export function TeamManager({ projectId }: { projectId: string }) {
    const queryClient = useQueryClient();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");

    // Fetch Members
    const { data: members = [] } = useQuery({
        queryKey: ['project-members', projectId],
        queryFn: async () => {
            // Note: In a real app, we'd join with auth.users/profiles table. 
            // Here we might just have the member record if we can't access auth users directly.
            // For MVP, we'll try to fetch what we can or rely on project_members containing metadata if added.
            const { data, error } = await supabase
                .from('project_members')
                .select('*')
                .eq('project_id', projectId);
            if (error) throw error;
            return data;
        }
    });

    // Fetch Pending Invitations
    const { data: invitations = [] } = useQuery({
        queryKey: ['project-invitations', projectId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('project_invitations')
                .select('*')
                .eq('project_id', projectId);
            if (error) {
                // Table might not exist yet if migration not run
                console.warn("Invitations table check failed", error);
                return [];
            }
            return data;
        }
    });

    const inviteMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.from('project_invitations').insert({
                project_id: projectId,
                email,
                role,
                token: Math.random().toString(36).substring(7), // Simple random token
                invited_by: (await supabase.auth.getUser()).data.user?.id
            });
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Invitation sent!");
            setIsInviteOpen(false);
            setEmail("");
            queryClient.invalidateQueries({ queryKey: ['project-invitations'] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to send invite");
        }
    });

    return (
        <div className="space-y-6">
            <Tabs defaultValue="members" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="members">Members & Invites</TabsTrigger>
                    <TabsTrigger value="rbac">Roles (RBAC)</TabsTrigger>
                    <TabsTrigger value="audit">Audit Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Team Members</h3>
                            <p className="text-sm text-muted-foreground">Manage who has access to this project.</p>
                        </div>
                        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <UserPlus className="size-4" />
                                    Invite Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Invite Team Member</DialogTitle>
                                    <DialogDescription>
                                        They will receive an email to join this project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <Input
                                            placeholder="colleague@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Role</label>
                                        <Select value={role} onValueChange={setRole}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                                                <SelectItem value="editor">Editor (Deploy & Config)</SelectItem>
                                                <SelectItem value="admin">Admin (Full Access)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                                    <Button onClick={() => inviteMutation.mutate()} disabled={!email || inviteMutation.isPending}>
                                        {inviteMutation.isPending ? "Sending..." : "Send Invite"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Invitations List */}
                    {invitations.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pending Invitations</h4>
                            <div className="grid gap-3">
                                {invitations.map((invite: any) => (
                                    <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                <Clock className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{invite.email}</p>
                                                <p className="text-xs text-muted-foreground">Invited as {invite.role}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                            Revoke
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Members List */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Members</h4>
                        <div className="border rounded-lg divide-y">
                            {/* Fallback to Owner if no members returned */}
                            <div className="flex items-center justify-between p-4 bg-card">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>ME</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">You (Owner)</p>
                                        <p className="text-xs text-muted-foreground">admin</p>
                                    </div>
                                </div>
                                <Badge variant="secondary">Owner</Badge>
                            </div>

                            {members.map((member: any) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-card">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{member.user_id?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">User {member.user_id?.substring(0, 6)}...</p>
                                            <p className="text-xs text-muted-foreground uppercase">{member.role}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="rbac">
                    <RbacVisualizer projectId={projectId} />
                </TabsContent>

                <TabsContent value="audit">
                    <AuditLogViewer projectId={projectId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
