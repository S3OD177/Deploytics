import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { SettingsForm } from '@/components/dashboard/SettingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Settings as SettingsIcon, Database, Info, Trash2 } from 'lucide-react'

export default function Settings() {
    const { user } = useAuth()

    const { data: subscription } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user?.id)
                .single()
            if (error && error.code !== 'PGRST116') throw error
            return data
        },
        enabled: !!user,
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account and preferences
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="general" className="gap-2">
                        <SettingsIcon className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="data" className="gap-2">
                        <Database className="h-4 w-4" />
                        Data & Storage
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <SettingsForm subscription={subscription} />
                </TabsContent>

                <TabsContent value="data" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5 text-orange-500" />
                                Data Retention Policy
                            </CardTitle>
                            <CardDescription>
                                How we manage your deployment history
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Auto-Cleanup Enabled</AlertTitle>
                                <AlertDescription>
                                    To optimize storage and keep your dashboard fast, deployment records
                                    <strong> older than 30 days are automatically deleted</strong> every week.
                                </AlertDescription>
                            </Alert>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 rounded-lg bg-secondary/50">
                                    <div className="text-2xl font-bold">30 days</div>
                                    <div className="text-sm text-muted-foreground">Retention period</div>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50">
                                    <div className="text-2xl font-bold">Weekly</div>
                                    <div className="text-sm text-muted-foreground">Cleanup frequency</div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Need longer retention? Contact us about our Enterprise plan with
                                unlimited data retention and dedicated support.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
