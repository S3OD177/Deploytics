import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { BillingOverview } from '@/components/dashboard/BillingOverview'

export default function Billing() {
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

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('id')
                .eq('user_id', user?.id)
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Billing</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your subscription and billing
                </p>
            </div>

            <BillingOverview
                subscription={subscription}
                projectCount={projects.length}
            />
        </div>
    )
}
