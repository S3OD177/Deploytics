// Simple in-memory rate limiter for API routes
// For production, use Redis or a proper rate limiting service

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number;  // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 60,       // 60 requests per minute
};

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { success: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // Clean up expired entries periodically
    if (rateLimitStore.size > 10000) {
        for (const [key, val] of rateLimitStore.entries()) {
            if (val.resetAt < now) {
                rateLimitStore.delete(key);
            }
        }
    }

    if (!entry || entry.resetAt < now) {
        // New window
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + config.windowMs,
        };
        rateLimitStore.set(identifier, newEntry);
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetAt: newEntry.resetAt,
        };
    }

    if (entry.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetAt: entry.resetAt,
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

// Helper to get rate limit headers
export function getRateLimitHeaders(result: ReturnType<typeof rateLimit>) {
    return {
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
    };
}
