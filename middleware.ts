import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // -------------------------------------------------------------
    // DIAGNOSTIC PASS-THROUGH
    // -------------------------------------------------------------
    // If this works: The issue is @supabase/ssr compatibility
    // If this fails: The issue is Next.js 15 Edge Runtime itself
    // -------------------------------------------------------------
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
