import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, env: NextFetchEvent) {

	if (req.nextUrl.pathname.startsWith("/checkout")) {

		const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET})

		if(!session) {			
			return NextResponse.redirect(new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url));
		}

		return NextResponse.next();

	}

	if (req.nextUrl.pathname.startsWith("/admin/user")) {

		
		const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

		if(!session) {	
			return NextResponse.redirect(new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url));
		}
		
		const validRoles = ['admin', 'super-user', 'SEO', 'client'];

		if(!validRoles.includes(session.user.role)) {
			return NextResponse.redirect(new URL('/', req.url));
		}

		return NextResponse.next();

	}

	if (req.nextUrl.pathname.startsWith("/api/admin/user")) {

		
		const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

		if(!session) {	  
			return NextResponse.redirect(new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url));
		}
		
		const validRoles = ['admin', 'super-user', 'SEO', 'client'];

		if(!validRoles.includes(session.user.role)) {
			return NextResponse.redirect(new URL('/', req.url));
		}

		return NextResponse.next();

	}
}

