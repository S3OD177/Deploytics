import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { AlertsConfig } from '@/components/dashboard/AlertsConfig'

export default function Alerts() {
    const { user } = useAuth()

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('id, name, status')
                .eq('user_id', user?.id)
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Alerts</h1>
                <p className="text-muted-foreground mt-1">
                    Configure deployment notifications and alerts
                </p>
            </div>

            <AlertsConfig projects={projects} />
        </div>
    )
}
