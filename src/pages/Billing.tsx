import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { CreditCard, Check, Zap } from 'lucide-react'

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'For personal projects',
        features: ['3 Projects', 'Basic analytics', 'Email support'],
        current: true,
    },
    {
        name: 'Pro',
        price: '$9',
        description: 'For growing teams',
        features: ['10 Projects', 'Advanced analytics', 'Priority support', 'Custom alerts'],
        popular: true,
    },
    {
        name: 'Enterprise',
        price: '$29',
        description: 'For large organizations',
        features: ['25 Projects', 'Full analytics suite', 'Dedicated support', 'Custom integrations'],
    },
]

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

    const currentPlan = subscription?.plan || 'free'

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Billing</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your subscription and billing
                </p>
            </div>

            {/* Current Plan */}
            <div className="bg-card border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Current Plan</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-2xl font-bold capitalize">{currentPlan}</p>
                        <p className="text-muted-foreground">
                            {subscription?.status === 'active' ? 'Active subscription' : 'Free tier'}
                        </p>
                    </div>
                    {currentPlan !== 'enterprise' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                            <Zap className="h-4 w-4" />
                            Upgrade
                        </button>
                    )}
                </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`bg-card border rounded-xl p-6 relative ${plan.popular ? 'border-primary shadow-lg' : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                Popular
                            </div>
                        )}
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                        <p className="text-3xl font-bold mb-6">
                            {plan.price}
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                        </p>
                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`w-full py-2.5 rounded-lg font-medium transition-colors ${plan.name.toLowerCase() === currentPlan
                                    ? 'bg-muted text-muted-foreground cursor-default'
                                    : 'bg-primary text-primary-foreground hover:opacity-90'
                                }`}
                            disabled={plan.name.toLowerCase() === currentPlan}
                        >
                            {plan.name.toLowerCase() === currentPlan ? 'Current Plan' : 'Select Plan'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
