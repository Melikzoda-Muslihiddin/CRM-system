// proxy.ts — в Next.js 16 это новое название для middleware.ts
// Выполняется на сервере перед каждым запросом, подходящим под matcher
//
// Защищает роуты: если не авторизован → перенаправляем на /login
//
// Как работает авторизация:
//   1. При логине ставим куку 'isAuthenticated=true'
//   2. Proxy читает куку при каждом запросе
//   3. Нет куки + пытается войти в /dashboard → редирект на /login
//   4. Есть кука + идёт на /login → редирект на /dashboard/clients

import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const { pathname } = request.nextUrl;

  // Если пытается попасть в /dashboard без авторизации — отправляем на /login
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Если уже авторизован и идёт на /login — отправляем в дашборд
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard/clients', request.url));
  }

  return NextResponse.next();
}

// matcher — на каких URL запускать proxy
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};