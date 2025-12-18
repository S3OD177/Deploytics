import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Github } from "lucide-react";
import { OverviewStats } from "@/components/dashboard/OverviewStats";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="size-5 text-primary" />
            </div>
            DevPulse
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center flex flex-col items-center mb-24">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/20 bg-primary/5 text-primary rounded-full animate-fade-in">
            v2.0 is now live — See what's new <ArrowRight className="ml-2 size-3 inline" />
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent drop-shadow-sm">
            Monitor your deployments with confidence
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Real-time insights, granular cost tracking, and seamless integrations.
            The all-in-one dashboard for modern engineering teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/overview">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Go to Dashboard <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-white/10 hover:bg-white/5">
                <Github className="mr-2 size-5" /> Star on GitHub
              </Button>
            </Link>
          </div>

          {/* Social Proof / Demo */}
          <div className="w-full max-w-5xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative rounded-xl border border-white/10 bg-card/50 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground">Live Telemetry</h3>
                  <p className="text-sm text-muted-foreground">Real-time production metrics</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 animate-pulse">
                  ● Live
                </Badge>
              </div>
              <OverviewStats totalProjects={24} activeBuilds={7} failedDeploys={0} />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16">Everything you need to ship faster</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="size-6 text-blue-400" />}
              title="Advanced Analytics"
              description="Deep dive into your build times, success rates, and deployment velocity over time."
            />
            <FeatureCard
              icon={<Zap className="size-6 text-amber-400" />}
              title="Instant Rollbacks"
              description="Deploy with confidence knowing you can revert to a stable state in seconds, not minutes."
            />
            <FeatureCard
              icon={<ShieldCheck className="size-6 text-green-400" />}
              title="Enterprise Security"
              description="SOC2 compliant infrastructure with role-based access control and audit logs."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10 text-center text-muted-foreground text-sm">
        <p>© 2025 DevPulse Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/50 border-white/5 hover:border-primary/20 transition-colors">
      <CardHeader>
        <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg ring-1 ring-white/10">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
