import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="mb-8">
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground">Last updated: December 2024</p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                    <p className="text-muted-foreground mb-4">
                        We collect information you provide directly: email address, profile information, and API tokens for connected services.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground mb-4">
                        Your information is used to provide the DevPulse service, including fetching deployment data and sending notifications.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Security</h2>
                    <p className="text-muted-foreground mb-4">
                        API tokens are encrypted at rest. We use Supabase with Row Level Security to ensure data isolation between users.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
                    <p className="text-muted-foreground mb-4">
                        We integrate with GitHub, Vercel, Supabase, and other platforms using their public APIs. Your data is fetched directly from these services.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Retention</h2>
                    <p className="text-muted-foreground mb-4">
                        Your data is retained as long as your account is active. You can request deletion at any time.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact</h2>
                    <p className="text-muted-foreground mb-4">
                        For privacy concerns, contact us at privacy@devpulse.app.
                    </p>
                </div>
            </div>
        </div>
    );
}
