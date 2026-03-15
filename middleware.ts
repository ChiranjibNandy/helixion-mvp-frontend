import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'hi']
const DEFAULT_LOCALE = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip if it's an internal Next.js path or API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 1. Check for cookie
  let locale = request.cookies.get('NEXT_LOCALE')?.value

  // 2. If no cookie, check Accept-Language header
  if (!locale) {
    const acceptLanguage = request.headers.get('accept-language')
    if (acceptLanguage) {
      // Basic detection logic: find the first supported locale in the header
      const detected = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].split('-')[0].toLowerCase())
        .find(lang => SUPPORTED_LOCALES.includes(lang))
      
      locale = detected || DEFAULT_LOCALE
    } else {
      locale = DEFAULT_LOCALE
    }
  }

  // 3. Ensure the locale is supported
  if (!SUPPORTED_LOCALES.includes(locale)) {
    locale = DEFAULT_LOCALE
  }

  const response = NextResponse.next()

  // 4. Set the cookie if it's not already set correctly
  if (request.cookies.get('NEXT_LOCALE')?.value !== locale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'lax'
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
