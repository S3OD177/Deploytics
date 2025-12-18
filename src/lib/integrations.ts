
interface ValidationResult {
    isValid: boolean;
    error?: string;
    metadata?: Record<string, any>;
}

export const IntegrationService = {
    async validateGitHub(token: string): Promise<ValidationResult> {
        try {
            const res = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (!res.ok) {
                return { isValid: false, error: 'Invalid GitHub token' };
            }

            const data = await res.json();
            return {
                isValid: true,
                metadata: {
                    username: data.login,
                    avatar_url: data.avatar_url,
                    html_url: data.html_url,
                }
            };
        } catch (error) {
            return { isValid: false, error: 'Failed to connect to GitHub' };
        }
    },

    async validateVercel(token: string): Promise<ValidationResult> {
        try {
            const res = await fetch('https://api.vercel.com/v2/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                return { isValid: false, error: 'Invalid Vercel token' };
            }

            const data = await res.json();
            return {
                isValid: true,
                metadata: {
                    username: data.user.username,
                    avatar_url: `https://vercel.com/api/www/avatar/${data.user.uid}`,
                    email: data.user.email,
                }
            };
        } catch (error) {
            return { isValid: false, error: 'Failed to connect to Vercel' };
        }
    },

    async validateSupabase(token: string): Promise<ValidationResult> {
        try {
            // Note: Supabase Management API requires an access token
            const res = await fetch('https://api.supabase.com/v1/projects', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                return { isValid: false, error: 'Invalid Supabase token' };
            }

            const data = await res.json();
            return {
                isValid: true,
                metadata: {
                    project_count: data.length,
                    projects: data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        ref: p.ref
                    }))
                }
            };
        } catch (error) {
            return { isValid: false, error: 'Failed to connect to Supabase' };
        }
    },

    // Generic validation helper if needed in future
    async validateGeneric(url: string, token: string): Promise<boolean> {
        try {
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            return res.ok;
        } catch {
            return false;
        }
    }
};
