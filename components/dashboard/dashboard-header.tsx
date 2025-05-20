"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { GlobeIcon as GolfBall } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const { signOut, user } = useAuth()

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <GolfBall className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TeeTimeRadar</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline-block">{user?.email}</span>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
