// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    if (req.cookies.has('tempauthtoken')) {
        return NextResponse.next();
    }

    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`);
    if (!tokenRes.ok) {
        return NextResponse.next();
    }
    const token = await tokenRes.text();
    const res = NextResponse.next();
    res.cookies.set({
        name:  'tempauthtoken',
        value: token,
        httpOnly: false, // makes it so that my
        sameSite: 'none',
        secure: true,
        //maxAge: 60
    });
    return res;
}

// Tell Next.js to run this on ALL routes:
export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
