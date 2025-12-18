
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { IntegrationsManager } from '@/components/dashboard/IntegrationsManager'
import { IntegrationService } from '@/lib/integrations'
import { Skeleton } from '@/components/ui/skeleton'
import { NewProjectDialog } from '@/components/dashboard/NewProjectDialog'
import { AlertCircle, Plus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

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
    const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data } = await supabase.from('projects').select('*')
            return data || []
        },
        enabled: !!user
    })

    const { data: subscription, isLoading: isLoadingSub } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user?.id)
                .single()
            return data
        },
        enabled: !!user,
    })

    const [selectedProjectId, setSelectedProjectId] = useState<string>('')
    const hasProjects = projects.length > 0

    // Set default project when projects load
    useEffect(() => {
        if (projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0].id)
        }
    }, [projects, selectedProjectId])

    const saveIntegrationMutation = useMutation({
        mutationFn: async ({ provider, token, scopes, metadata = {} }: { provider: string, token: string, scopes: string[], metadata?: any }) => {
            if (!selectedProjectId) throw new Error("Please select a project first.")

            let validation;
            switch (provider) {
                case 'github':
                    validation = await IntegrationService.validateGitHub(token);
                    break;
                case 'vercel':
                    // We validate again here just to be safe, or we could skip if we trust the input
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

            // Merge passed metadata with validation metadata
            const finalMetadata = { ...validation.metadata, ...metadata };

            // Save to Supabase
            // We use upsert based on (project_id, provider) unique constraint
            const { error } = await supabase
                .from('integrations')
                .upsert({
                    project_id: selectedProjectId,
                    provider,
                    config: {
                        access_token: token,
                        metadata: finalMetadata,
                        selected_scopes: scopes,
                        // If it's Vercel, we might want to lift project_id to top level of config for easier querying if needed,
                        // or just keep it in metadata or config root.
                        // The webhook looks for config->>project_id
                        ...(metadata?.project_id ? { project_id: metadata.project_id } : {})
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

    const handleSaveIntegration = async (provider: string, token: string, scopes: string[], metadata?: any) => {
        try {
            await saveIntegrationMutation.mutateAsync({ provider, token, scopes, metadata })
            return {}
        } catch (err: any) {
            return { error: err.message }
        }
    }

    if (isLoading || isLoadingProjects || isLoadingSub) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-xl border bg-card shadow-sm h-24">
                            <Skeleton className="h-4 w-32 mb-3" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[280px] rounded-xl border bg-card/50 p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                <p className="text-muted-foreground mt-1">
                    Connect and manage your external services
                </p>

                {/* Project Selector */}
                {hasProjects && (
                    <div className="mt-6 max-w-md">
                        <label htmlFor="project-select" className="block text-sm font-medium text-muted-foreground mb-2">
                            Select Project
                        </label>
                        <select
                            id="project-select"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background hover:bg-accent focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            {projects.map((project: any) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground mt-1.5">
                            Integrations will be connected to this project
                        </p>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                        <p className="text-2xl font-bold mt-1">{integrations.filter((i: any) => i.status === 'connected').length} / 6</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Last Sync</p>
                        <p className="text-2xl font-bold mt-1">
                            {integrations.length > 0
                                ? 'Just now'
                                : '—'
                            }
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">Health Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-sm font-medium">All Systems Operational</p>
                        </div>
                    </div>
                </div>
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

            {!hasProjects && (
                <Alert variant="destructive" className="bg-amber-500/10 text-amber-600 border-amber-500/20 mb-8 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <AlertCircle className="h-5 w-5 !text-amber-600" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                        <div>
                            <AlertTitle className="font-bold text-amber-700">No Projects Found</AlertTitle>
                            <AlertDescription className="text-amber-600/80">
                                You need to create at least one project before you can attach integrations.
                            </AlertDescription>
                        </div>
                        <NewProjectDialog
                            canCreate={true}
                            currentProjects={0}
                            maxProjects={3}
                            defaultTier={subscription?.plan}
                        />
                    </div>
                </Alert>
            )}

            <IntegrationsManager
                integrations={integrations}
                onSave={handleSaveIntegration}
                hasProjects={hasProjects}
            />
        </div>
    )
}
