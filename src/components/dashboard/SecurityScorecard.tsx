
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";

export function SecurityScorecard() {
    // Determine score based on checks
    const checks = [
        { id: 'rls', label: 'Row Level Security', status: 'pass' },
        { id: 'mfa', label: 'Multi-Factor Auth (Org)', status: 'warn' },
        { id: 'ip', label: 'IP Allowlist', status: 'fail' },
        { id: 'audit', label: 'Audit Logging', status: 'pass' },
    ];

    const score = 75; // Mocked score for MVP
    const grade = "B";

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-indigo-500" />
                        Security Scorecard
                    </CardTitle>
                    <span className="text-2xl font-bold text-indigo-600">{grade}</span>
                </div>
                <CardDescription>
                    Automated analysis of your project's security posture.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Overall Score</span>
                        <span className="font-medium">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-2" />
                </div>

                <div className="space-y-3">
                    {checks.map((check) => (
                        <div key={check.id} className="flex items-center justify-between p-2 rounded bg-muted/20 border">
                            <span className="text-sm font-medium">{check.label}</span>
                            {check.status === 'pass' && <div className="flex items-center text-green-500 text-xs font-semibold gap-1"><CheckCircle2 className="w-4 h-4" /> PASS</div>}
                            {check.status === 'warn' && <div className="flex items-center text-yellow-500 text-xs font-semibold gap-1"><AlertTriangle className="w-4 h-4" /> WARN</div>}
                            {check.status === 'fail' && <div className="flex items-center text-red-500 text-xs font-semibold gap-1"><XCircle className="w-4 h-4" /> FAIL</div>}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
