;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertCircle, Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    link?: string;
    created_at: string;
}

const TYPE_ICONS = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
};

const TYPE_COLORS = {
    info: "text-blue-500",
    success: "text-emerald-500",
    warning: "text-amber-500",
    error: "text-red-500",
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();

        // Subscribe to realtime notifications
        const channel = supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
            }, (payload) => {
                setNotifications(prev => [payload.new as Notification, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        setNotifications(data || []);
        setLoading(false);
    };

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length === 0) return;

        await supabase
            .from('notifications')
            .update({ read: true })
            .in('id', unreadIds);

        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-[10px] bg-red-500"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <span className="font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={markAllAsRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground text-sm">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const Icon = TYPE_ICONS[notification.type];
                            return (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex items-start gap-3 p-3 cursor-pointer",
                                        !notification.read && "bg-accent/50"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <Icon className={cn("size-5 mt-0.5 shrink-0", TYPE_COLORS[notification.type])} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{notification.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
                                    )}
                                </DropdownMenuItem>
                            );
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
