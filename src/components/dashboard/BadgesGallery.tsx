
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Zap, Moon, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function BadgesGallery() {
    // Mocked badges for now, would fetch from user_badges table equivalent
    const badges = [
        { id: 'night-owl', name: 'Night Owl', icon: Moon, desc: 'Deployed between 12 AM and 4 AM', earned: true, date: '2023-12-15' },
        { id: 'speed-demon', name: 'Speed Demon', icon: Zap, desc: 'Optimized build time under 30s', earned: true, date: '2023-12-10' },
        { id: 'clean-coder', name: 'Clean Coder', icon: CheckCircle2, desc: '10 successful deployments in a row', earned: true, date: '2023-11-05' },
        { id: 'early-bird', name: 'Early Bird', icon: Award, desc: 'Deployed before 7 AM', earned: false },
    ];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-orange-500" />
                    Achievements
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    <TooltipProvider>
                        {badges.map((badge) => (
                            <Tooltip key={badge.id}>
                                <TooltipTrigger>
                                    <div className={`flex flex-col items-center gap-1 group cursor-default ${badge.earned ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                                        <div className={`p-3 rounded-full ${badge.earned ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-muted text-muted-foreground'}`}>
                                            <badge.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-medium text-center hidden group-hover:block absolute -bottom-6 bg-popover px-2 py-1 rounded shadow text-popover-foreground z-10 w-max">
                                            {badge.name}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                                    {badge.earned && <p className="text-xs text-orange-500 mt-1">Earned on {badge.date}</p>}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}
