
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, User, Loader2 } from "lucide-react";

interface OrganizationMember {
    id: string;
    role: 'owner' | 'admin' | 'developer' | 'viewer';
    user_id: string;
    created_at: string;
    // user_metadata would come from a join usually, but for now we might mock or fetch differently
    // auth.users is not directly joinable in client usually, unless we have a public profile table.
    // For this "Read Only" demo, we'll assume we have a way or show generic user.
}

interface RbacVisualizerProps {
    projectId: string; // We might need orgId, or derive it.
}

export function RbacVisualizer({ projectId }: RbacVisualizerProps) {
    // 1. Fetch Project to get Org ID
    const { data: project } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const { data } = await supabase.from('projects').select('organization_id').eq('id', projectId).single();
            return data;
        },
        enabled: !!projectId
    });

    const orgId = project?.organization_id;

    // 2. Fetch Members
    const { data: members, isLoading } = useQuery({
        queryKey: ['org-members', orgId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('organization_members')
                .select('*')
                .eq('organization_id', orgId);
            if (error) throw error;
            return data as OrganizationMember[];
        },
        enabled: !!orgId
    });

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
    }

    // Role Badge Helper
    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'owner': return <Badge variant="default" className="bg-purple-600">Owner</Badge>;
            case 'admin': return <Badge variant="secondary">Admin</Badge>;
            case 'developer': return <Badge variant="outline" className="border-blue-500 text-blue-500">Developer</Badge>;
            default: return <Badge variant="outline">Viewer</Badge>;
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-500" />
                    Team Roles (RBAC)
                </CardTitle>
                <CardDescription>
                    Read-only view of organization members and their assigned permissions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {members && members.length > 0 ? (
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium leading-none">
                                                User {member.user_id.substring(0, 8)}...
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Joined {new Date(member.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {getRoleBadge(member.role)}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No members found or access restricted.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
