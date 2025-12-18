"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (provider: 'github' | 'google') => {
        try {
            setLoading(true);
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) {
                toast.error(error.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm border-border bg-card shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                        <div className="bg-primary/10 rounded-full size-10 flex items-center justify-center text-primary">
                            {/* Check icon or logo */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-6"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center text-foreground">DevPulse</CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Sign in to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button
                        className="w-full gap-2"
                        variant="outline"
                        onClick={() => handleLogin('github')}
                        disabled={loading}
                    >
                        <Github className="size-4" />
                        GitHub
                    </Button>
                    <Button
                        className="w-full gap-2"
                        variant="outline"
                        onClick={() => handleLogin('google')}
                        disabled={loading}
                    >
                        <svg role="img" viewBox="0 0 24 24" className="size-4 fill-current"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
                        Google
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-center text-muted-foreground w-full">
                        By clicking continue, you agree to our{" "}
                        <a href="#" className="underline hover:text-primary">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-primary">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
