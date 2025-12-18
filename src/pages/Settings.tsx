import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { SettingsForm } from '@/components/dashboard/SettingsForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings as SettingsIcon } from 'lucide-react'

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
                </TabsList>

                <TabsContent value="general">
                    <SettingsForm subscription={subscription} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
