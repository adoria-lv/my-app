import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Allow sign-in page
  if (pathname === '/admin/sign-in') {
    return
  }

  // Protect all admin routes except sign-in
  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      const url = req.url.replace(pathname, '/admin/sign-in')
      return Response.redirect(url)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
