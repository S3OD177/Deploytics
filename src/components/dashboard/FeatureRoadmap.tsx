
import { useState, useMemo } from 'react';
import { features, Feature } from '@/lib/features-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Check, Lock, Sparkles, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function FeatureRoadmap() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [enabledFeatures, setEnabledFeatures] = useState<number[]>([]);

    const categories = useMemo(() => ["All", ...Array.from(new Set(features.map(f => f.category)))], []);

    const filteredFeatures = features.filter(f => {
        const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "All" || f.category === activeTab;
        return matchesSearch && matchesTab;
    });

    const toggleFeature = (id: number) => {
        setEnabledFeatures(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const implementedCount = features.filter(f => f.status === 'implemented').length;
    const userEnabledCount = enabledFeatures.length;
    const totalProgress = ((implementedCount + userEnabledCount) / features.length) * 100;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        Future Galaxy <Sparkles className="h-6 w-6 text-purple-500" />
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Explore and activate the full 500-feature roadmap.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-muted-foreground">
                            Roadmap Progress: {Math.round(totalProgress)}%
                        </span>
                        <Progress value={totalProgress} className="w-32 h-2" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 bg-background z-10 py-4 border-b">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search 500 features (e.g., 'AR/VR', 'NFT')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Tabs defaultValue="All" className="w-full md:w-auto overflow-x-auto" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="All">All</TabsTrigger>
                        <TabsTrigger value="Analytics & Metrics">Analytics</TabsTrigger>
                        <TabsTrigger value="Gamification">Gamification</TabsTrigger>
                        <TabsTrigger value="Security & Privacy">Security</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFeatures.map((feature) => {
                    const isImplemented = feature.status === 'implemented';
                    const isEnabled = enabledFeatures.includes(feature.id);
                    const isActive = isImplemented || isEnabled;

                    return (
                        <Card key={feature.id} className={`border transition-all hover:shadow-md ${isActive ? 'border-primary/50 bg-primary/5' : 'opacity-70 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant={isActive ? "default" : "outline"} className="text-[10px] mb-2">
                                        #{feature.id}
                                    </Badge>
                                    {isImplemented ? (
                                        <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">Live</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px]">Backlog</Badge>
                                    )}
                                </div>
                                <CardTitle className="text-sm font-medium leading-tight">
                                    {feature.title}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1 truncate">
                                    {feature.category}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                {isImplemented ? (
                                    <Button disabled size="sm" className="w-full h-8 cursor-default bg-emerald-500 hover:bg-emerald-500 text-white">
                                        <Check className="h-3 w-3 mr-1" /> Active
                                    </Button>
                                ) : (
                                    <Button
                                        variant={isEnabled ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleFeature(feature.id)}
                                        className={`w-full h-8 ${isEnabled ? "animate-pulse" : ""}`}
                                    >
                                        {isEnabled ? (
                                            <>Simulating...</>
                                        ) : (
                                            <>Enable Preview</>
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredFeatures.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No features found matching "{searchQuery}"
                </div>
            )}
        </div>
    );
}
