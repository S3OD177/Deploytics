import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Github,
  Cloud,
  Database,
  BarChart3,
  Bell,
  Users,
  Shield,
  ArrowRight,
  Check,
  Star
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="size-4 text-primary" />
            </div>
            <span className="font-bold text-lg">DevPulse</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6" variant="secondary">
            <Star className="size-3 mr-1 fill-yellow-500 text-yellow-500" />
            Trusted by 500+ developers
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Your Unified
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500"> DevOps Dashboard</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor GitHub, Vercel, Supabase, and more in one place. Track deployments, manage costs, and get instant alerts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-8">
                Start Free <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              <Github className="size-4" />
              View on GitHub
            </Button>
          </div>

          {/* Integration Logos */}
          <div className="mt-16 flex items-center justify-center gap-8 opacity-60">
            <Github className="size-8" />
            <Cloud className="size-8" />
            <Database className="size-8" />
            <span className="text-sm text-muted-foreground">+ more</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              One dashboard to rule all your deployments and infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Cloud,
                title: "Multi-Platform Support",
                description: "Connect GitHub, Vercel, Supabase, Netlify, Railway, and more."
              },
              {
                icon: BarChart3,
                title: "Cost Awareness",
                description: "Track spending across platforms before bills surprise you."
              },
              {
                icon: Bell,
                title: "Instant Alerts",
                description: "Get notified immediately when deployments fail or costs spike."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Invite team members with role-based access control."
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description: "Live deployment status and metrics synced every minute."
              },
              {
                icon: Shield,
                title: "Secure by Default",
                description: "Your tokens are encrypted. We only request read access."
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Free", price: 0, projects: 3, team: 1, highlight: false },
              { name: "Pro", price: 9, projects: 10, team: 5, highlight: true },
              { name: "Enterprise", price: 29, projects: 25, team: 15, highlight: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${plan.highlight ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border bg-card'}`}
              >
                {plan.highlight && (
                  <Badge className="mb-4 bg-primary text-primary-foreground">Most Popular</Badge>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-emerald-500" />
                    {plan.projects} projects
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-emerald-500" />
                    {plan.team} team member{plan.team > 1 ? 's' : ''}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-emerald-500" />
                    All integrations
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                    {plan.price === 0 ? 'Start Free' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Need more projects? <Link href="/billing" className="text-primary hover:underline">Buy add-ons</Link> starting at $19.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to simplify your DevOps?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join hundreds of developers who monitor their infrastructure with DevPulse.
          </p>
          <Link href="/login">
            <Button size="lg" className="px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              <span className="font-semibold">DevPulse</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="https://github.com" className="hover:text-foreground">GitHub</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 DevPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
