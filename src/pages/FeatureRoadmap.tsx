
import { useState, useMemo } from 'react';
import { featuresList, generateInfiniteFeatures, FeatureIdea } from '@/lib/features-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search, Filter, ThumbsUp, CheckCircle, Circle, Map as MapIcon,
    Zap, Shield, Smartphone, Share2, Server, Globe
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Icons map
const CategoryIcons: Record<string, any> = {
    'AI': Zap,
    'Security': Shield,
    'DevOps': Server,
    'Analytics': Globe,
    'Collaboration': Share2,
    'Mobile': Smartphone,
    'Blockchain': LinkIcon,
    'IoT': WifiIcon
};

function LinkIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function WifiIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>; }

const ALL_FEATURES = generateInfiniteFeatures();

export default function FeatureRoadmap() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set());
    const [visibleCount, setVisibleCount] = useState(50);

    const filteredFeatures = useMemo(() => {
        return ALL_FEATURES.filter(f => {
            const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "All" || f.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, categoryFilter]);

    const displayFeatures = filteredFeatures.slice(0, visibleCount);

    const toggleFeature = (id: string, title: string) => {
        const newSet = new Set(enabledFeatures);
        if (newSet.has(id)) {
            newSet.delete(id);
            toast.info(`Feature disabled: ${title}`);
        } else {
            newSet.add(id);
            toast.success(`Feature enabled: ${title} (Simulated)`);
        }
        setEnabledFeatures(newSet);
    };

    const categories = ["All", ...Array.from(new Set(ALL_FEATURES.map(f => f.category)))];

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent flex items-center gap-3">
                        <MapIcon className="size-10 text-pink-500" />
                        The Infinite Roadmap
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Explore, vote on, and beta-test over 500+ upcoming features.
                        The future is already here—just unevenly distributed.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg border">
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                        {ALL_FEATURES.length} Ideas
                    </Badge>
                    <Badge variant="default" className="text-lg px-4 py-1 bg-green-600 hover:bg-green-700">
                        {enabledFeatures.size} Active
                    </Badge>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search 500+ ideas (e.g., 'Quantum', 'AI', 'Voice')..."
                        className="pl-10 h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px] h-10">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayFeatures.map((feature) => {
                    const Icon = CategoryIcons[feature.category] || Circle;
                    const isEnabled = enabledFeatures.has(feature.id);

                    return (
                        <Card key={feature.id}
                            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 ${isEnabled ? 'border-l-green-500 bg-green-500/5' : 'border-l-transparent'}`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="mb-2 w-fit flex items-center gap-1">
                                        <Icon className="size-3" />
                                        {feature.category}
                                    </Badge>
                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                        <ThumbsUp className="size-3" />
                                        {feature.votes.toLocaleString()}
                                    </div>
                                </div>
                                <CardTitle className="text-lg leading-tight">{feature.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-1">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mt-2">
                                    <Badge className={
                                        feature.impact === 'High' ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" :
                                            feature.impact === 'Medium' ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" :
                                                "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                    }>
                                        {feature.impact} Impact
                                    </Badge>
                                    <Button
                                        size="sm"
                                        variant={isEnabled ? "default" : "outline"}
                                        className={isEnabled ? "bg-green-600 hover:bg-green-700" : ""}
                                        onClick={() => toggleFeature(feature.id, feature.title)}
                                    >
                                        {isEnabled ? (
                                            <>
                                                <CheckCircle className="size-4 mr-2" />
                                                Active
                                            </>
                                        ) : (
                                            "Enable"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Load More */}
            {visibleCount < filteredFeatures.length && (
                <div className="flex justify-center pt-8">
                    <Button variant="secondary" size="lg" onClick={() => setVisibleCount(c => c + 50)}>
                        Load More Features ({filteredFeatures.length - visibleCount} remaining)
                    </Button>
                </div>
            )}

            {filteredFeatures.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No features found matching "{searchQuery}" in this category.
                </div>
            )}
        </div>
    );
}
