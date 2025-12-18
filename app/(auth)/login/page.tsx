"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Github, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleLogin = async (provider: 'github' | 'google') => {
        try {
            setLoading(provider);
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
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel: Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-12 flex-col justify-between">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <Zap className="size-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">DevPulse</span>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Monitor your<br />deployments<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">in real-time</span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-md">
                            Track GitHub commits, Vercel deployments, and infrastructure costs in one beautiful dashboard.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-emerald-500"></div>
                            <span>99.9% Uptime</span>
                        </div>
                        <div className="w-px h-4 bg-zinc-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-blue-500"></div>
                            <span>Real-time Updates</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10">
                    <blockquote className="space-y-3">
                        <p className="text-zinc-300 italic">
                            "DevPulse transformed how we monitor our infrastructure. The real-time insights are invaluable."
                        </p>
                        <footer className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                SD
                            </div>
                            <div>
                                <p className="text-white font-medium">Sofia Davis</p>
                                <p className="text-zinc-500 text-sm">Engineering Lead, Acme Inc</p>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center space-y-2">
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                                <Zap className="size-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">DevPulse</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            className="w-full h-12 gap-3 text-base font-medium"
                            variant="outline"
                            onClick={() => handleLogin('github')}
                            disabled={loading !== null}
                        >
                            {loading === 'github' ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <Github className="size-5" />
                            )}
                            Continue with GitHub
                        </Button>
                        <Button
                            className="w-full h-12 gap-3 text-base font-medium"
                            variant="outline"
                            onClick={() => handleLogin('google')}
                            disabled={loading !== null}
                        >
                            {loading === 'google' ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <svg role="img" viewBox="0 0 24 24" className="size-5 fill-current">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                </svg>
                            )}
                            Continue with Google
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-3 text-muted-foreground">
                                Secure authentication
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
