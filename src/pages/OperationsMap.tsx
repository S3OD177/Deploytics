
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Server, Activity, Wifi, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Regions
const REGIONS = [
    { id: "iad1", name: "US East (N. Virginia)", lat: 38, lng: -77, status: "healthy", latency: "24ms", load: 45 },
    { id: "sfo1", name: "US West (San Francisco)", lat: 37, lng: -122, status: "healthy", latency: "42ms", load: 60 },
    { id: "fra1", name: "EU Central (Frankfurt)", lat: 50, lng: 8, status: "healthy", latency: "38ms", load: 30 },
    { id: "sin1", name: "Asia Pacific (Singapore)", lat: 1, lng: 103, status: "warning", latency: "145ms", load: 85 },
    { id: "syd1", name: "Asia Pacific (Sydney)", lat: -33, lng: 151, status: "healthy", latency: "89ms", load: 20 },
    { id: "gru1", name: "SA East (São Paulo)", lat: -23, lng: -46, status: "healthy", latency: "110ms", load: 40 },
];

export default function OperationsMap() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Globe className="size-8 text-primary" />
                        Global Operations
                    </h1>
                    <p className="text-muted-foreground">
                        Real-time edge network telemetry and traffic visualization.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-muted/30 px-4 py-2 rounded-lg border border-border/50">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-mono text-muted-foreground">SYSTEM TIME</span>
                        <span className="text-sm font-bold font-mono">{currentTime.toLocaleTimeString()} UTC</span>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex flex-col items-end text-emerald-500">
                        <span className="text-xs font-mono text-muted-foreground">NETWORK STATUS</span>
                        <span className="text-sm font-bold flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            OPERATIONAL
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Map Area */}
                <Card className="lg:col-span-3 bg-[#0a0f1c] border-indigo-500/20 relative overflow-hidden flex items-center justify-center group">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {/* World Map Concept using CSS/SVG placeholder */}
                    <div className="relative w-full h-full max-w-4xl opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <svg viewBox="0 0 1000 500" className="w-full h-full">
                            <path d="M150,150 Q200,50 350,150 T650,150 T900,250" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary/20 animate-[dash_20s_linear_infinite]" />
                            <path d="M100,350 Q300,450 500,350 T800,400" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary/20 animate-[dash_25s_linear_infinite]" />
                        </svg>
                    </div>

                    {/* Region Markers */}
                    {REGIONS.map((region) => {
                        // Simple projection map logic (very rough) to place dots
                        // Map standard lat/lng to % x/y
                        // Lon: -180 to 180 -> 0-100%
                        // Lat: 90 to -90 -> 0-100%
                        const x = ((region.lng + 180) / 360) * 100;
                        const y = ((90 - region.lat) / 180) * 100;

                        return (
                            <button
                                key={region.id}
                                className={cn(
                                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                                    selectedRegion === region.id ? "scale-125 z-20" : "scale-100 z-10 hover:scale-110"
                                )}
                                style={{ left: `${x}%`, top: `${y}%` }}
                                onClick={() => setSelectedRegion(region.id)}
                            >
                                <div className="relative flex items-center justify-center">
                                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", region.status === 'healthy' ? "bg-emerald-400" : "bg-amber-400")}></span>
                                    <div className={cn("relative rounded-full p-2 border-2", region.status === 'healthy' ? "bg-emerald-950 border-emerald-500 text-emerald-500" : "bg-amber-950 border-amber-500 text-amber-500")}>
                                        <Server className="size-4" />
                                    </div>
                                    {selectedRegion === region.id && (
                                        <div className="absolute top-full mt-2 bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap border z-30">
                                            {region.name}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </Card>

                {/* Sidebar Stats */}
                <div className="lg:col-span-1 space-y-4 overflow-y-auto">
                    {REGIONS.map((region) => (
                        <div
                            key={region.id}
                            className={cn(
                                "p-4 rounded-lg border transition-all cursor-pointer",
                                selectedRegion === region.id
                                    ? "bg-primary/5 border-primary ring-1 ring-primary/20"
                                    : "bg-card hover:bg-muted/50 border-border/50"
                            )}
                            onClick={() => setSelectedRegion(region.id)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-semibold text-sm flex items-center gap-2">
                                    <MapPin className="size-3.5 text-muted-foreground" />
                                    {region.name}
                                </div>
                                <Badge variant={region.status === 'healthy' ? 'outline' : 'destructive'} className="text-[10px] h-5 uppercase">
                                    {region.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-muted/30 p-2 rounded text-center">
                                    <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                                        <Wifi className="size-2.5" /> Latency
                                    </div>
                                    <div className={cn("font-mono font-bold mt-1", region.status === 'warning' ? "text-amber-500" : "")}>{region.latency}</div>
                                </div>
                                <div className="bg-muted/30 p-2 rounded text-center">
                                    <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                                        <Activity className="size-2.5" /> Load
                                    </div>
                                    <div className="font-mono font-bold mt-1">{region.load}%</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <div className="flex items-center gap-2 font-bold text-sm mb-1">
                            <ShieldCheck className="size-4" />
                            DDoS Protection Active
                        </div>
                        <p className="text-xs opacity-80">
                            Global mitigation enabled. 0 attacks detected in last 24h.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
