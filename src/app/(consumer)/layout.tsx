// import { Button } from "@/components/ui/button"
import { canAccessAdminPages } from "@/permissions/general"
import { getCurrentUser } from "@/services/clerk"
import ButtonN from "@/components/ButtonN"
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { ReactNode, Suspense } from "react"

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function Navbar() {
  return (
    <header className="container flex h-12 shadow bg-background z-10">
      <nav className="flex gap-4 container">
        <Link
          className="mr-auto text-lg hover:underline flex items-center"
          href="/"
        >
          Web Dev Simplified
        </Link>
        <Suspense>
          {/* <SignedIn> */}
            <AdminLink />
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/courses"
            >
              My Courses
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/purchases"
            >
              Purchase History
            </Link>
            <div className="size-8 self-center">
              {/* <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              /> */}
            </div>
          {/* </SignedIn> */}
        </Suspense>
        <Suspense>
          {/* <SignedOut> */}
              <ButtonN className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                {/* <Link href="/sign-in">
                  Sign In
                </Link> */}
                {/* <SignInButton>Sign In</SignInButton> */}
              </ButtonN>
            {/* <Button className="self-center" asChild>
              <SignInButton>Sign In</SignInButton>
            </Button> */}
          {/* </SignedOut> */}
        </Suspense>
      </nav>
    </header>
  )
}

async function AdminLink() {
  const user = await getCurrentUser()
  if (!canAccessAdminPages(user)) return null

  return (
    <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
      Admin
    </Link>
  )
  // return (
  //   <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
  //     Admin
  //   </Link>
  // )
}