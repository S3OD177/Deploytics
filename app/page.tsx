import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-2xl font-bold text-primary">DevPulse</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Monitor your deployments with <span className="text-primary">DevPulse</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Real-time insights, cost awareness, and seamless integrations for your engineering team.
        </p>
        <div className="flex gap-4">
          <Link href="/overview">
            <Button size="lg">Go to Dashboard (Demo)</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
