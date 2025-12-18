;

import { Mail, Shield, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
    userEmail: string;
    userPlan?: string;
}

export function SettingsForm({ userEmail, userPlan = "Free" }: SettingsFormProps) {
    return (
        <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-8 pb-20">
            {/* Breadcrumbs & Heading */}
            <div className="flex flex-col gap-6">
                <nav className="flex items-center text-sm font-medium text-muted-foreground">
                    <a className="hover:text-foreground transition-colors" href="#">Home</a>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Settings</span>
                </nav>
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Settings & Privacy</h1>
                    <p className="text-muted-foreground text-lg">Manage your account settings, integrations, and data preferences.</p>
                </div>
            </div>

            {/* Account Card */}
            <section className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Account</h2>
                    <p className="text-sm text-muted-foreground mt-1">Update your personal information and plan details.</p>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-muted-foreground size-5" />
                            <Input
                                className="w-full bg-background border-border py-2.5 pl-10 pr-4 text-sm cursor-not-allowed opacity-75"
                                disabled
                                type="email"
                                defaultValue={userEmail}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-muted-foreground">Current Plan</Label>
                        <div className="flex items-center h-[40px]">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                {userPlan}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Connected Integrations */}
            <section className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Connected Integrations</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your connections to third-party services.</p>
                </div>
                <div className="divide-y divide-border">
                    <IntegrationRow
                        name="GitHub"
                        status="Connected"
                        description="Read-only access to public and private repositories."
                        icon="github"
                    />
                    <IntegrationRow
                        name="Vercel"
                        status="Connected"
                        description="Access to deployment status and build logs."
                        icon="vercel"
                    />
                </div>
            </section>

            {/* Data & Privacy */}
            <section className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Data & Privacy</h2>
                    <p className="text-sm text-muted-foreground mt-1">Control how your data is stored and handled.</p>
                </div>
                <div className="p-6">
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-5 mb-8">
                        <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                            <Shield className="size-5" />
                            Security Summary
                        </h4>
                        <ul className="space-y-3">
                            <SecurityItem text={<>We only request <strong>read-only access</strong> to your repositories.</>} />
                            <SecurityItem text={<><strong>No source code</strong> is ever stored on our servers.</>} />
                            <SecurityItem text={<>All access tokens are <strong>AES-256 encrypted</strong> at rest.</>} />
                        </ul>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border">
                        <h3 className="text-lg font-medium text-foreground mb-2">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-6">Irreversible actions related to your data storage.</p>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-red-900/30 bg-red-950/10 gap-4">
                            <div>
                                <h4 className="text-sm font-semibold text-red-400">Delete all stored metadata</h4>
                                <p className="text-xs text-red-300/60 mt-0.5">This will remove all cached commit history and deployment logs.</p>
                            </div>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20">
                                Delete Metadata
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="flex justify-center py-8 text-muted-foreground text-sm">
                <p>© 2024 DevPulse Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}

function IntegrationRow({ name, status, description, icon }: any) {
    return (
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="size-12 rounded-lg bg-background flex items-center justify-center border border-white/10 shrink-0">
                    {icon === 'github' ? (
                        // Simple placeholder for GitHub icon
                        <div className="font-bold text-xl">GH</div>
                    ) : (
                        // Simple placeholder for Vercel icon
                        <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 1155 1000" xmlns="http://www.w3.org/2000/svg">
                            <path d="M577.344 0L1154.69 1000H0L577.344 0Z" fill="currentColor"></path>
                        </svg>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{name}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {status}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <Button variant="outline" className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 w-full md:w-auto">
                Disconnect
            </Button>
        </div>
    )
}

function SecurityItem({ text }: { text: React.ReactNode }) {
    return (
        <li className="flex items-start gap-3">
            <CheckCircle className="text-emerald-500 size-5 shrink-0" />
            <span className="text-sm text-muted-foreground">{text}</span>
        </li>
    )
}
