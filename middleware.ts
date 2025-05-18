// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    if (req.cookies.has('tempauthtoken')) {
        return NextResponse.next();
    }
    let token = null;
    try {
        const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`);
        if (!tokenRes.ok) {
            return NextResponse.next();
        }
        token = await tokenRes.text();
    } catch(err) {}
    const res = NextResponse.next();
    if(token){
        res.cookies.set({
            name: 'tempauthtoken',
            value: token,
            httpOnly: false,
            sameSite: 'none',
            secure: true,
            maxAge: 60 * 60 * 24 * 365 * 5 // 5 years in seconds
        });
    }
    return res;
}

// Tell Next.js to run this on ALL routes:
export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
