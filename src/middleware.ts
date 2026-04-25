import { NextResponse } from 'next/server';
import { checkRateLimit } from './lib/rate-limit';
import { edgeAuth } from './lib/auth.config';

export default edgeAuth(async (req) => {
  const { nextUrl, ip } = req;

  // Only apply to API routes, excluding auth
  if (nextUrl.pathname.startsWith('/api') && !nextUrl.pathname.startsWith('/api/auth')) {
    // Identify user by ID if logged in, otherwise by IP
    // Note: With edgeAuth, we rely on JWT being present in the cookie
    const userId = req.auth?.user?.id;
    const identifier = userId || ip || '127.0.0.1';

    // Limits: authenticated users get more requests
    const limit = userId ? 100 : 30; // 100 per min for users, 30 for guests
    const windowMs = 60 * 1000; // 1 minute window

    const result = checkRateLimit(identifier, limit, windowMs);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'You have exceeded the rate limit. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.floor(result.reset / 1000).toString(),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.floor(result.reset / 1000).toString());
    return response;
  }

  return NextResponse.next();
});

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/api/:path*'],
};
