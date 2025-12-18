
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trophy, Users, Star, Flame, GitCommit,
    ArrowUpRight, MessageSquare, Heart, Share2, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const LEADERBOARD = [
    { rank: 1, name: "Sarah Chen", handle: "@sarah_c", avatar: "/avatars/sarah.jpg", score: 15420, streak: 45, badges: ["🚀", "⚡", "🛡️"] },
    { rank: 2, name: "Alex Rivera", handle: "@arivera", avatar: "/avatars/alex.jpg", score: 14200, streak: 12, badges: ["🔥", "🐛"] },
    { rank: 3, name: "Mike Johnson", handle: "@mike_j", avatar: "/avatars/mike.jpg", score: 13850, streak: 30, badges: ["👑", "💎"] },
    { rank: 4, name: "Emily Davis", handle: "@emily_d", avatar: "/avatars/emily.jpg", score: 12100, streak: 5, badges: ["🎯"] },
    { rank: 5, name: "David Kim", handle: "@dkim_dev", avatar: "/avatars/david.jpg", score: 11950, streak: 18, badges: ["⚡", "🛡️"] },
];

const FEED_ITEMS = [
    {
        id: 1,
        user: "Sarah Chen",
        handle: "@sarah_c",
        timestamp: "10m ago",
        content: "Just deployed a new Next.js 14 template with Supabase Auth pre-configured! 🚀 Check it out.",
        likes: 124,
        comments: 18,
        type: "blueprint"
    },
    {
        id: 2,
        user: "Alex Rivera",
        handle: "@arivera",
        timestamp: "45m ago",
        content: "Hit a 99.99% uptime streak on my main production cluster for 30 days straight. Deploytics auto-scaling saved me twice last night.",
        likes: 89,
        comments: 12,
        type: "achievement"
    },
    {
        id: 3,
        user: "Deploytics Bot",
        handle: "@system",
        timestamp: "2h ago",
        content: "New Challenge Available: 'Weekend Warrior'. Deploy 5 times this weekend to earn the limited edition badge.",
        likes: 256,
        comments: 0,
        type: "announcement"
    }
];

export default function Community() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Users className="size-8 text-primary" />
                    Community Hub
                </h1>
                <p className="text-muted-foreground">
                    Connect with top developers, share blueprints, and climb the global leaderboards.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="feed" className="w-full">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="feed">Global Feed</TabsTrigger>
                            <TabsTrigger value="following">Following</TabsTrigger>
                            <TabsTrigger value="blueprints">Trending Blueprints</TabsTrigger>
                        </TabsList>

                        <TabsContent value="feed" className="space-y-4 mt-4">
                            {FEED_ITEMS.map((item) => (
                                <Card key={item.id} className="overflow-hidden bg-card/50 border-border/50 transition-all hover:bg-card hover:border-border">
                                    <div className="p-6 flex gap-4">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.handle}`} />
                                            <AvatarFallback>{item.user[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{item.user}</span>
                                                        <span className="text-muted-foreground text-sm">{item.handle}</span>
                                                        <span className="text-muted-foreground text-xs">• {item.timestamp}</span>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <ArrowUpRight className="size-4" />
                                                </Button>
                                            </div>

                                            <p className="text-sm leading-relaxed">
                                                {item.content}
                                            </p>

                                            <div className="flex items-center gap-6 pt-2">
                                                <button className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors text-xs">
                                                    <Heart className="size-4" />
                                                    {item.likes}
                                                </button>
                                                <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors text-xs">
                                                    <MessageSquare className="size-4" />
                                                    {item.comments}
                                                </button>
                                                <button className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors text-xs">
                                                    <Share2 className="size-4" />
                                                    Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Leaderboard & Stats */}
                <div className="space-y-6">
                    {/* Weekly Top */}
                    <Card className="border-amber-500/20 bg-amber-500/5">
                        <CardHeader className="pb-3 text-amber-500">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Trophy className="size-5" />
                                Weekly Top Deployers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {LEADERBOARD.map((user, i) => (
                                <div key={user.handle} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                        i === 0 ? "bg-amber-400 text-black" :
                                            i === 1 ? "bg-slate-300 text-black" :
                                                i === 2 ? "bg-orange-400 text-black" : "bg-muted text-muted-foreground"
                                    )}>
                                        {user.rank}
                                    </div>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.handle}`} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate flex items-center gap-1">
                                            {user.name}
                                            {i === 0 && <Crown className="size-3 text-amber-400 fill-amber-400" />}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span className="flex items-center gap-0.5 text-amber-500">
                                                <Flame className="size-3" /> {user.streak}
                                            </span>
                                            <span>{user.score.toLocaleString()} XP</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Trending Topics */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium uppercase text-muted-foreground tracking-wider">
                                Trending Topics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {["#NextJS14", "#Supabase", "#Serverless", "#Rust", "#DevOps", "#AWS"].map(tag => (
                                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
