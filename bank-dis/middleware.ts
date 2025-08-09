import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};


// Type	Name	Value
// A	
// @
// 216.198.79.1


// CNAME	
// www
// 78d325684a5e577d.vercel-dns-017.com

