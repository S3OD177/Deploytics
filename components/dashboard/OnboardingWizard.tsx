"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Check,
    ArrowRight,
    Github,
    Cloud,
    Database,
    Bell,
    Zap,
    Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = [
    {
        id: 1,
        title: "Welcome to DevPulse",
        description: "Your unified DevOps dashboard for monitoring deployments across all your platforms.",
        icon: Zap,
        action: "Get Started",
    },
    {
        id: 2,
        title: "Connect Your First Integration",
        description: "Link GitHub, Vercel, or Supabase to start tracking deployments.",
        icon: Github,
        action: "Connect Integration",
        href: "/settings/integrations",
    },
    {
        id: 3,
        title: "Create Your First Project",
        description: "Organize your deployments by creating a project.",
        icon: Rocket,
        action: "Create Project",
        href: "/overview",
    },
    {
        id: 4,
        title: "Set Up Alerts",
        description: "Get notified when deployments fail or costs spike.",
        icon: Bell,
        action: "Configure Alerts",
        href: "/alerts",
    },
];

export function OnboardingWizard({
    onComplete,
    completedSteps = []
}: {
    onComplete: () => void;
    completedSteps?: number[];
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();
    const progress = (completedSteps.length / STEPS.length) * 100;

    const handleAction = (step: typeof STEPS[0]) => {
        if (step.href) {
            router.push(step.href);
        } else if (step.id === STEPS.length) {
            onComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSkip = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const currentStepData = STEPS[currentStep - 1];
    const Icon = currentStepData.icon;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center pb-2">
                    <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">Step {currentStep} of {STEPS.length}</Badge>
                        <Button variant="ghost" size="sm" onClick={handleSkip}>
                            Skip
                        </Button>
                    </div>
                    <Progress value={progress} className="h-1 mb-6" />

                    <div className="mx-auto size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="size-8 text-primary" />
                    </div>

                    <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                        {currentStepData.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {/* Step indicators */}
                    <div className="flex justify-center gap-2 mb-6">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "size-2 rounded-full transition-colors",
                                    step.id === currentStep ? "bg-primary" :
                                        completedSteps.includes(step.id) ? "bg-emerald-500" : "bg-muted"
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            size="lg"
                            className="w-full gap-2"
                            onClick={() => handleAction(currentStepData)}
                        >
                            {currentStepData.action}
                            <ArrowRight className="size-4" />
                        </Button>

                        {currentStep === STEPS.length && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full"
                                onClick={onComplete}
                            >
                                Skip onboarding
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
