// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/next"
// import { env } from "./data/env/server"
// import { setUserCountryHeader } from "./lib/userCountryHeader"
// import { NextResponse } from "next/server"

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/api(.*)",
//   "/courses/:courseId/lessons/:lessonId",
//   "/products(.*)",
// ])

// const isAdminRoute = createRouteMatcher(["/admin(.*)"])

// const aj = arcjet({
//   key: env.ARCJET_KEY,
//   rules: [
//     shield({ mode: "LIVE" }),
//     detectBot({
//       mode: "LIVE",
//       allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
//     }),
//     slidingWindow({
//       mode: "LIVE",
//       interval: "1m",
//       max: 100,
//     }),
//   ],
// })

// export default clerkMiddleware(async (auth, req) => {
//   const decision = await aj.protect(
//     env.TEST_IP_ADDRESS
//       ? { ...req, ip: env.TEST_IP_ADDRESS, headers: req.headers }
//       : req
//   )

//   if (decision.isDenied()) {
//     return new NextResponse(null, { status: 403 })
//   }

//   if (isAdminRoute(req)) {
//     const user = await auth.protect()
//     if (user.sessionClaims.role !== "admin") {
//       return new NextResponse(null, { status: 404 })
//     }
//   }

//   if (!isPublicRoute(req)) {
//     await auth.protect()
//   }

//   if (!decision.ip.isVpn() && !decision.ip.isProxy()) {
//     const headers = new Headers(req.headers)
//     setUserCountryHeader(headers, decision.ip.country)

//     return NextResponse.next({ request: { headers } })
//   }
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// }
import { NextRequest, NextResponse } from "next/server"
import { setUserCountryHeader } from "./lib/userCountryHeader"

const publicRoutes = ["/", "/login", "/register"]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  )

  const userId = req.cookies.get("userId")?.value
  const role = req.cookies.get("role")?.value

  // protected routes
  if (!isPublicRoute && !userId) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // admin routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    return new NextResponse(null, { status: 404 })
  }

  // country header
  const headers = new Headers(req.headers)

  setUserCountryHeader(headers, "UA")

  return NextResponse.next({
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|svg|ico)).*)",
    "/(api|trpc)(.*)",
  ],
}