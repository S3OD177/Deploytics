import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useRealtimeDeployments() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const handleDeploymentChange = useCallback(() => {
        // Invalidate and refetch deployment-related queries
        queryClient.invalidateQueries({ queryKey: ['deployments'] })
        queryClient.invalidateQueries({ queryKey: ['all-deployments'] })
        queryClient.invalidateQueries({ queryKey: ['projects'] })
    }, [queryClient])

    useEffect(() => {
        if (!user) return

        // Subscribe to deployment changes
        const channel = supabase
            .channel('deployments-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'deployments',
                },
                (payload) => {
                    console.log('Deployment change:', payload)
                    handleDeploymentChange()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, handleDeploymentChange])
}

export function useRealtimeProjects() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const handleProjectChange = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
    }, [queryClient])

    useEffect(() => {
        if (!user) return

        const channel = supabase
            .channel('projects-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'projects',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('Project change:', payload)
                    handleProjectChange()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, handleProjectChange])
}
