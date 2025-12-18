import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useRealtimeDeployments, useRealtimeProjects } from '@/hooks/useRealtime'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NotificationBell } from '@/components/dashboard/NotificationBell'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    FolderKanban,
    Bell,
    Settings,
    CreditCard,
    LogOut,
    Rocket,
    Search,
    Link2,
    Activity,
    Sparkles,
    Bot,
    Globe,
    FileText,
    Users,
    Swords,
    Building2,
    ShieldAlert,
    Flag,
    Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Integrations', href: '/integrations', icon: Link2 },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Intelligence', href: '/intelligence', icon: Bot },
    { name: 'Ops Map', href: '/map', icon: Globe },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Quests', href: '/challenges', icon: Swords },
    { name: 'Enterprise', href: '/enterprise', icon: Building2 },
    { name: 'Security', href: '/security', icon: ShieldAlert },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout() {
    const { user, signOut } = useAuth()

    // Enable realtime updates
    useRealtimeDeployments()
    useRealtimeProjects()

    const handleOpenCommandPalette = () => {
        // Dispatch keyboard event to trigger command palette
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
                <div className="flex h-16 items-center gap-2 px-6 border-b">
                    <Rocket className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Deploytics</span>
                </div>

                {/* Search button */}
                <div className="p-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-muted-foreground"
                        onClick={handleOpenCommandPalette}
                    >
                        <Search className="h-4 w-4" />
                        <span className="flex-1 text-left">Search...</span>
                        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                            ⌘K
                        </kbd>
                    </Button>
                </div>

                <nav className="flex flex-col gap-1 px-4">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* User section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                                {user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-full items-center justify-end gap-4 px-8">
                        <NotificationBell />
                        <ThemeToggle />
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
