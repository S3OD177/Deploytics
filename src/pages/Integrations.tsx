import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { IntegrationsManager } from '@/components/dashboard/IntegrationsManager'
import { IntegrationService } from '@/lib/integrations'
import { Loader2 } from 'lucide-react'

export default function Integrations() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const { data: integrations = [], isLoading } = useQuery({
        queryKey: ['integrations'],
        queryFn: async () => {
            // RLS automatically filters integrations for projects owned by the user.

            if (!user) return []

            const { data, error } = await supabase
                .from('integrations')
                .select('*')

            if (error) throw error
            return data || []
        },
        enabled: !!user,
    })

    // We need a project to attach to. The schema enforces it.
    // For this task, I'll fetch the user's first project to use as the default target.
    const { data: defaultProject } = useQuery({
        queryKey: ['default-project'],
        queryFn: async () => {
            const { data } = await supabase
                .from('projects')
                .select('id')
                .eq('user_id', user?.id)
                .limit(1)
                .single()
            return data
        },
        enabled: !!user
    })

    const saveIntegrationMutation = useMutation({
        mutationFn: async ({ provider, token }: { provider: string, token: string }) => {
            if (!defaultProject) throw new Error("No project found to attach integration to. Please create a project first.")

            let validation;
            switch (provider) {
                case 'github':
                    validation = await IntegrationService.validateGitHub(token);
                    break;
                case 'vercel':
                    validation = await IntegrationService.validateVercel(token);
                    break;
                case 'supabase':
                    validation = await IntegrationService.validateSupabase(token);
                    break;
                default:
                    // For others, we might accept blindly or add validation
                    validation = { isValid: true, metadata: {} };
            }

            if (!validation.isValid) {
                throw new Error(validation.error || 'Invalid token');
            }

            // Save to Supabase
            // We use upsert based on (project_id, provider) unique constraint
            const { error } = await supabase
                .from('integrations')
                .upsert({
                    project_id: defaultProject.id,
                    provider,
                    config: {
                        access_token: token,
                        metadata: validation.metadata
                    },
                    status: 'connected',
                    last_synced_at: new Date().toISOString()
                }, { onConflict: 'project_id,provider' })

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['integrations'] })
        }
    })

    const handleSaveIntegration = async (provider: string, token: string) => {
        try {
            await saveIntegrationMutation.mutateAsync({ provider, token })
            return {}
        } catch (err: any) {
            return { error: err.message }
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Integrations</h1>
                <p className="text-muted-foreground mt-1">
                    Connect your favorite services to Deploytics
                </p>
                {/* User explanation of data handling */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border max-w-3xl">
                    <p className="font-semibold mb-1">Data Privacy & Security</p>
                    <p>
                        When you connect an integration, we save your <strong>readonly access token</strong> securely.
                        We only fetch metadata (like project names, deployment status, and user profile info) to display in your dashboard.
                        Your tokens are never shared.
                    </p>
                </div>
            </div>

            <IntegrationsManager
                integrations={integrations}
                onSave={handleSaveIntegration}
            />
        </div>
    )
}
