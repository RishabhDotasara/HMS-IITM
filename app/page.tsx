/**
 * v0 by Vercel.
 * @see https://v0.dev/t/njLSccaakcx
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/ModeToggle"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="fixed top-10 right-10">
        <ModeToggle/>
      </div>
      <div className=" text-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl w-full ">
          Welcome to <span className="text-blue-500">Institute Manager</span> for IIT-M
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your all in one place for Institute Chores.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Admin Check-In
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            prefetch={false}
          >
            Student Check-In
          </Link>
        </div>
      </div>
      
    </div>
  )
}