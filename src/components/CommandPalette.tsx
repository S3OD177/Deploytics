import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
    LayoutDashboard,
    FolderKanban,
    Bell,
    CreditCard,
    Settings,
    Search,
    ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COMMANDS = [
    { name: 'Go to Dashboard', icon: LayoutDashboard, href: '/overview' },
    { name: 'Go to Projects', icon: FolderKanban, href: '/projects' },
    { name: 'Go to Alerts', icon: Bell, href: '/alerts' },
    { name: 'Go to Billing', icon: CreditCard, href: '/billing' },
    { name: 'Go to Settings', icon: Settings, href: '/settings' },
]

export function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const navigate = useNavigate()

    const filteredCommands = COMMANDS.filter((cmd) =>
        cmd.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = useCallback((href: string) => {
        setOpen(false)
        setSearch('')
        navigate(href)
    }, [navigate])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open with Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setOpen(true)
            }

            // Close with Escape
            if (e.key === 'Escape') {
                setOpen(false)
            }

            // Navigate with arrow keys
            if (open) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSelectedIndex((i) => Math.max(i - 1, 0))
                }
                if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                    e.preventDefault()
                    handleSelect(filteredCommands[selectedIndex].href)
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, filteredCommands, selectedIndex, handleSelect])

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0)
    }, [search])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg p-0 overflow-hidden">
                <DialogTitle className="sr-only">Command Palette</DialogTitle>
                <div className="flex items-center border-b px-3">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Type a command or search..."
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                    />
                    <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                        ESC
                    </kbd>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {filteredCommands.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                            No commands found.
                        </p>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.href}
                                onClick={() => handleSelect(cmd.href)}
                                className={cn(
                                    'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                                    index === selectedIndex
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent'
                                )}
                            >
                                <cmd.icon className="h-4 w-4" />
                                <span className="flex-1 text-left">{cmd.name}</span>
                                <ArrowRight className="h-3 w-3 opacity-50" />
                            </button>
                        ))
                    )}
                </div>
                <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-center gap-4">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    <span>Esc Close</span>
                </div>
            </DialogContent>
        </Dialog>
    )
}
