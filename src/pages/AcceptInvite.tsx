
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AcceptInvite() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'success'>('loading');
    const [invitation, setInvitation] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        async function validateInvite() {
            if (!token) {
                setStatus('invalid');
                return;
            }

            const { data, error } = await supabase
                .from('project_invitations')
                .select('*, projects(name)')
                .eq('token', token)
                .eq('status', 'pending')
                .single();

            if (error || !data) {
                setStatus('invalid');
            } else {
                setInvitation(data);
                setStatus('valid');
            }
        }

        validateInvite();
    }, [token]);

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Please log in to accept the invitation");
                navigate('/login', { state: { from: window.location.pathname } });
                return;
            }

            // check if already a member
            const { data: existing } = await supabase
                .from('project_members')
                .select('id')
                .eq('project_id', invitation.project_id)
                .eq('user_id', user.id)
                .single();

            if (existing) {
                toast.info("You're already a member of this project");
                navigate(`/projects/${invitation.project_id}`);
                return;
            }

            // Logic: Invitations usually handle joining as a different email too.
            // For MVP: We just add the current logged-in user.

            const { error: joinError } = await supabase.from('project_members').insert({
                project_id: invitation.project_id,
                user_id: user.id,
                role: invitation.role
            });

            if (joinError) throw joinError;

            // Update invitation status
            await supabase
                .from('project_invitations')
                .update({ status: 'accepted' })
                .eq('id', invitation.id);

            toast.success(`Joined ${invitation.projects.name}!`);
            setStatus('success');

            setTimeout(() => {
                navigate(`/projects/${invitation.project_id}`);
            }, 2000);

        } catch (error: any) {
            toast.error(error.message || "Failed to accept invitation");
        } finally {
            setIsProcessing(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 text-center">
                    <CardHeader>
                        <XCircle className="size-12 text-destructive mx-auto mb-4" />
                        <CardTitle>Invalid Invitation</CardTitle>
                        <CardDescription>
                            This link may have expired or already been used.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-emerald-500/20 bg-emerald-500/5 text-center">
                    <CardHeader>
                        <CheckCircle className="size-12 text-emerald-500 mx-auto mb-4" />
                        <CardTitle>Welcome to the Team!</CardTitle>
                        <CardDescription>
                            Redirecting you to the project dashboard...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border bg-card shadow-lg">
                <CardHeader className="text-center">
                    <div className="size-16 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                        <Users className="size-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Project Invitation</CardTitle>
                    <CardDescription className="text-base mt-2">
                        You've been invited to join <span className="font-bold text-foreground">{(invitation as any)?.projects.name}</span> as a <span className="font-bold text-foreground capitalize">{(invitation as any)?.role}</span>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground pb-8 italic">
                    By accepting, you'll gain access to deployment analytics and metrics for this project.
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        className="w-full h-11 text-base font-semibold"
                        onClick={handleAccept}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <Loader2 className="size-5 animate-spin mr-2" /> : "Accept Invitation"}
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
                        Decline
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
