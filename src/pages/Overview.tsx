import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import {
    Activity,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
} from 'lucide-react'

export default function Overview() {
    const { user } = useAuth()

    // Fetch projects
    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user?.id)
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    // Fetch deployments
    const { data: deployments = [] } = useQuery({
        queryKey: ['deployments'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deployments')
                .select('*, projects(name)')
                .order('created_at', { ascending: false })
                .limit(10)
            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    const successCount = deployments.filter((d: any) => d.status === 'success').length
    const failedCount = deployments.filter((d: any) => d.status === 'failed').length

    const stats = [
        {
            name: 'Total Projects',
            value: projects.length,
            icon: Activity,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            name: 'Successful Deploys',
            value: successCount,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            name: 'Failed Deploys',
            value: failedCount,
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
        },
        {
            name: 'Total Deployments',
            value: deployments.length,
            icon: TrendingUp,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back! Here&apos;s your deployment summary.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-card border rounded-xl p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.name}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Deployments */}
            <div className="bg-card border rounded-xl">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Recent Deployments</h2>
                </div>
                <div className="divide-y">
                    {deployments.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            No deployments yet. Connect a project to get started.
                        </div>
                    ) : (
                        deployments.map((deployment: any) => (
                            <div key={deployment.id} className="p-4 flex items-center gap-4">
                                <div className={`p-2 rounded-full ${deployment.status === 'success'
                                        ? 'bg-green-500/10'
                                        : deployment.status === 'failed'
                                            ? 'bg-red-500/10'
                                            : 'bg-yellow-500/10'
                                    }`}>
                                    {deployment.status === 'success' ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : deployment.status === 'failed' ? (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {deployment.projects?.name || 'Unknown Project'}
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {deployment.commit_message || 'No message'}
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(deployment.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
