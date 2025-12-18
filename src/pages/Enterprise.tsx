
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Building2, ShieldCheck, Key, Lock, FileSearch,
    Settings, Users, CheckCircle2, History
} from "lucide-react";
import { cn } from "@/lib/utils";

const AUDIT_LOGS = [
    { id: 1, action: "API_KEY_CREATED", user: "admin@deploytics.com", target: "Production Key", ip: "192.168.1.1", time: "2 mins ago" },
    { id: 2, action: "ROLE_UPDATED", user: "sarah@deploytics.com", target: "Developer Group", ip: "10.0.0.12", time: "1 hour ago" },
    { id: 3, action: "SSO_CONFIG_CHANGED", user: "system", target: "Okta Integration", ip: "Internal", time: "3 hours ago" },
    { id: 4, action: "DEPLOYMENT_ROLLBACK", user: "alex@deploytics.com", target: "frontend-prod-v12", ip: "172.16.0.5", time: "5 hours ago" },
];

const ROLES = [
    { name: "Owner", users: 1, permissions: ["Full Access", "Billing", "Audit Logs"] },
    { name: "Admin", users: 3, permissions: ["Manage Users", "Configure SSO", "Deploy Prod"] },
    { name: "Developer", users: 12, permissions: ["Deploy Dev", "View Logs", "Manage Keys"] },
    { name: "Viewer", users: 5, permissions: ["Read Only"] },
];

export default function Enterprise() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Building2 className="size-8 text-primary" />
                    Enterprise Portal
                </h1>
                <p className="text-muted-foreground">
                    Manage Single Sign-On (SSO), enforce Role-Based Access Control (RBAC), and view comprehensive audit trails.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SSO Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="size-5 text-indigo-500" />
                            Single Sign-On (SSO)
                        </CardTitle>
                        <CardDescription>Connect your identity provider for centralized access.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-md">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" className="size-5" alt="Google" />
                                </div>
                                <div className="font-semibold">Google Workspace</div>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                <CheckCircle2 className="size-3 mr-1" /> Connected
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-md flex items-center justify-center text-white font-bold h-9 w-9 text-xs">
                                    Okta
                                </div>
                                <div className="font-semibold">Okta SAML</div>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="text-sm font-semibold mb-2">SAML Configuration</h3>
                            <div className="grid gap-3">
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Entity ID</div>
                                    <Input value="https://deploytics.com/saml/metadata" readOnly className="font-mono text-xs h-8 bg-muted" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">ACS URL</div>
                                    <Input value="https://deploytics.com/saml/acs" readOnly className="font-mono text-xs h-8 bg-muted" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="size-5 text-amber-500" />
                            Audit Logs
                        </CardTitle>
                        <CardDescription>Recent administrative actions and security events.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {AUDIT_LOGS.map((log) => (
                                <div key={log.id} className="flex items-start gap-3 text-sm pb-3 border-b last:border-0 last:pb-0">
                                    <FileSearch className="size-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1 space-y-0.5">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{log.action}</span>
                                            <span className="text-xs text-muted-foreground">{log.time}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            User: <span className="text-foreground">{log.user}</span> • Target: {log.target}
                                        </div>
                                        <div className="text-[10px] font-mono opacity-70">
                                            Source IP: {log.ip}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                                View Full History
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* RBAC Matrix */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="size-5 text-emerald-500" />
                            Role-Based Access Control (RBAC)
                        </CardTitle>
                        <CardDescription>
                            Define permissions for each user role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            {ROLES.map((role) => (
                                <div key={role.name} className="border rounded-lg p-4 space-y-3 bg-card/50">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">{role.name}</div>
                                        <Users className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{role.users}</div>
                                    <div className="text-xs text-muted-foreground">Active Users</div>
                                    <div className="pt-2 border-t space-y-1">
                                        {role.permissions.map(p => (
                                            <div key={p} className="text-xs flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-primary" />
                                                {p}
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="secondary" size="sm" className="w-full mt-2 h-7 text-xs">
                                        Edit Policy
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
