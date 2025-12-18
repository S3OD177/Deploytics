
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ShieldAlert, Lock, Fingerprint, Eye,
    AlertTriangle, CheckCircle2, Globe, FileWarning
} from "lucide-react";
import { cn } from "@/lib/utils";

const VULNERABILITIES = [
    { id: "CVE-2024-1002", package: "axios", severity: "Critical", description: "SSRF vulnerability in request handling.", fixedIn: "1.6.4" },
    { id: "CVE-2023-4501", package: "lodash", severity: "High", description: "Prototype pollution in merge function.", fixedIn: "4.17.22" },
    { id: "CVE-2023-3301", package: "next-auth", severity: "Medium", description: "Potential open redirect in callback.", fixedIn: "4.24.5" },
];

const COMPLIANCE = [
    { standard: "SOC2 Type II", status: "checking", score: 85, issues: 2 },
    { standard: "HIPAA", status: "compliant", score: 100, issues: 0 },
    { standard: "GDPR", status: "compliant", score: 98, issues: 0 },
    { standard: "ISO 27001", status: "warning", score: 62, issues: 5 },
];

export default function Security() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <ShieldAlert className="size-8 text-primary" />
                    Security Command
                </h1>
                <p className="text-muted-foreground">
                    Real-time threat intelligence, vulnerability scanning, and compliance management.
                </p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-emerald-500">98/100</div>
                            <div className="text-xs font-semibold text-muted-foreground">Security Score</div>
                        </div>
                        <ShieldAlert className="size-8 text-emerald-500/20" />
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5 border-red-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-red-500">3</div>
                            <div className="text-xs font-semibold text-muted-foreground">Critical CVEs</div>
                        </div>
                        <AlertTriangle className="size-8 text-red-500/20" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold">124</div>
                            <div className="text-xs font-semibold text-muted-foreground">Threats Blocked</div>
                        </div>
                        <Globe className="size-8 text-muted-foreground/20" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold">24d</div>
                            <div className="text-xs font-semibold text-muted-foreground">Since Last Incident</div>
                        </div>
                        <CheckCircle2 className="size-8 text-muted-foreground/20" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vulnerability Scanner */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileWarning className="size-5 text-amber-500" />
                            Dependency Vulnerabilities
                        </CardTitle>
                        <CardDescription>
                            Automated scan of your package.json and lockfiles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {VULNERABILITIES.map((vuln) => (
                                <div key={vuln.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-card/50 border">
                                    <div className="min-w-[100px]">
                                        <Badge variant={vuln.severity === 'Critical' ? 'destructive' : vuln.severity === 'High' ? 'default' : 'secondary'}>
                                            {vuln.severity}
                                        </Badge>
                                        <div className="mt-2 font-mono text-xs text-muted-foreground">{vuln.id}</div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="font-semibold flex items-center gap-2">
                                            {vuln.package}
                                            <span className="text-xs font-normal text-muted-foreground">Fixed in {vuln.fixedIn}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{vuln.description}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="shrink-0 h-8 self-start">
                                        Auto-Fix
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Scorecard */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="size-5 text-indigo-500" />
                            Compliance
                        </CardTitle>
                        <CardDescription>Readiness status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {COMPLIANCE.map((std) => (
                            <div key={std.standard} className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span>{std.standard}</span>
                                    <span className={cn(
                                        std.score >= 90 ? "text-emerald-500" :
                                            std.score >= 70 ? "text-yellow-500" : "text-red-500"
                                    )}>{std.score}%</span>
                                </div>
                                <Progress value={std.score} className="h-2" />
                            </div>
                        ))}

                        <div className="border-t pt-4 mt-4">
                            <Button className="w-full gap-2" variant="secondary">
                                <Fingerprint className="size-4" />
                                Generate PII Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
