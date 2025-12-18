import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="mb-8">
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground">Last updated: December 2024</p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground mb-4">
                        By accessing and using DevPulse, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
                    <p className="text-muted-foreground mb-4">
                        DevPulse provides a unified dashboard for monitoring deployments, tracking costs, and managing integrations across various development platforms.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
                    <p className="text-muted-foreground mb-4">
                        You are responsible for maintaining the confidentiality of your account and access tokens. You agree to notify us immediately of any unauthorized use.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">4. Payment Terms</h2>
                    <p className="text-muted-foreground mb-4">
                        Paid subscriptions are billed monthly through Polar.sh. Add-on purchases are one-time payments. Refunds are handled on a case-by-case basis.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
                    <p className="text-muted-foreground mb-4">
                        DevPulse is provided "as is" without warranties. We are not liable for any damages arising from the use of this service.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact</h2>
                    <p className="text-muted-foreground mb-4">
                        For questions about these terms, contact us at support@devpulse.app.
                    </p>
                </div>
            </div>
        </div>
    );
}
