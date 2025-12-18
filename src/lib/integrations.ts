
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
                const errorBody = await res.text();
                console.error('[GitHub Validation] API Error:', res.status, errorBody);
                return { isValid: false, error: `GitHub API Error (${res.status}): ${errorBody.substring(0, 100)}` };
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
        } catch (error: any) {
            console.error('[GitHub Validation] Network/CORS Error:', error);
            return { isValid: false, error: error.message || 'Failed to connect to GitHub (possible CORS issue)' };
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
                const errorBody = await res.text();
                console.error('[Vercel Validation] API Error:', res.status, errorBody);
                return { isValid: false, error: `Vercel API Error (${res.status}): ${errorBody.substring(0, 100)}` };
            }

            const data = await res.json();
            return {
                isValid: true,
                metadata: {
                    username: data.user?.username,
                    avatar_url: data.user?.uid ? `https://vercel.com/api/www/avatar/${data.user.uid}` : undefined,
                    email: data.user?.email,
                }
            };
        } catch (error: any) {
            console.error('[Vercel Validation] Network/CORS Error:', error);
            return { isValid: false, error: error.message || 'Failed to connect to Vercel (possible CORS issue)' };
        }
    },

    async validateSupabase(token: string): Promise<ValidationResult> {
        try {
            const res = await fetch('https://api.supabase.com/v1/projects', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorBody = await res.text();
                console.error('[Supabase Validation] API Error:', res.status, errorBody);
                return { isValid: false, error: `Supabase API Error (${res.status}): ${errorBody.substring(0, 100)}` };
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
        } catch (error: any) {
            console.error('[Supabase Validation] Network/CORS Error:', error);
            return { isValid: false, error: error.message || 'Failed to connect to Supabase (possible CORS issue)' };
        }
    },

    // Generic validation helper with detailed error logging
    async validateGeneric(url: string, token: string, providerName: string = 'Generic'): Promise<ValidationResult> {
        try {
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

            if (!res.ok) {
                const errorBody = await res.text();
                console.error(`[${providerName} Validation] API Error:`, res.status, errorBody);
                return { isValid: false, error: `${providerName} API Error (${res.status}): ${errorBody.substring(0, 100)}` };
            }

            return { isValid: true, metadata: {} };
        } catch (error: any) {
            console.error(`[${providerName} Validation] Network/CORS Error:`, error);
            return { isValid: false, error: error.message || `Failed to connect to ${providerName} (possible CORS issue)` };
        }
    }
};

