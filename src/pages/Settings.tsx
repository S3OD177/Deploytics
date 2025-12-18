import { useAuth } from '@/hooks/useAuth'
import { Settings as SettingsIcon, User, Shield, Bell } from 'lucide-react'

export default function Settings() {
    const { user } = useAuth()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings
                </p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <div className="bg-card border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Profile</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-muted text-muted-foreground"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">User ID</label>
                            <input
                                type="text"
                                value={user?.id || ''}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-muted text-muted-foreground font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-card border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Security</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <p className="font-medium">Two-factor authentication</p>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security
                                </p>
                            </div>
                            <button className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                                Enable
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">Change password</p>
                                <p className="text-sm text-muted-foreground">
                                    Update your password
                                </p>
                            </div>
                            <button className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-card border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between py-3 border-b cursor-pointer">
                            <div>
                                <p className="font-medium">Email notifications</p>
                                <p className="text-sm text-muted-foreground">
                                    Receive deployment alerts via email
                                </p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between py-3 cursor-pointer">
                            <div>
                                <p className="font-medium">Weekly digest</p>
                                <p className="text-sm text-muted-foreground">
                                    Get a weekly summary of deployments
                                </p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 rounded" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
