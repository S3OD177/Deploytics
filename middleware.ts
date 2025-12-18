import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // PASS-THROUGH MIDDLEWARE
    // Supabase auth logic temporarily removed to isolate crash source.
    // If this deploys successfully, the issue is with @supabase/ssr in this environment.
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
