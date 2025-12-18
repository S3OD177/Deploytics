import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Initialize response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Check Environment Variables safely
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Log diagnostic info (will show in Vercel logs)
    // console.log('[Middleware] Starting auth check for:', request.nextUrl.pathname)

    if (!supabaseUrl || !supabaseKey) {
        console.warn('[Middleware] MISSING ENV VARS. url:', !!supabaseUrl, 'key:', !!supabaseKey)
        // Return without auth if configuration is missing
        return response
    }

    try {
        // 3. Initialize Supabase Client
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value)
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // 4. Refresh Session
        await supabase.auth.getUser()

    } catch (error) {
        // 5. Catch any initialization/runtime errors
        console.error('[Middleware] CRITICAL ERROR:', error)
        // Return original response to keep site alive
        return response
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
