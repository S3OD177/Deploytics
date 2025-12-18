
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export function SsoSettings() {
    return (
        <Card className="border-indigo-100 bg-indigo-50/10">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-indigo-600" />
                        Single Sign-On (SSO)
                    </CardTitle>
                    <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">ENTERPRISE</span>
                </div>
                <CardDescription>
                    Configure SAML (Okta, Azure AD) or OIDC for your organization.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-indigo-200 bg-indigo-50/20 text-center space-y-3">
                    <div className="p-3 bg-indigo-100 rounded-full">
                        <Lock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-indigo-900">Upgrade to Enterprise</h4>
                        <p className="text-sm text-indigo-700/80 max-w-sm mt-1">
                            SSO, Audit Log Retention (1 Year), and Priority Support are available on the Enterprise plan.
                        </p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm mt-2">
                        Contact Sales
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
