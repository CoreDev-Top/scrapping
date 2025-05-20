"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CreateAlertForm } from "@/components/dashboard/create-alert-form"
import { AlertList } from "@/components/dashboard/alert-list"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  const handleAlertCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Tee Time Alerts</h1>

        <div className="grid gap-8 md:grid-cols-[300px_1fr] md:divide-x">
          <div>
            <CreateAlertForm onAlertCreated={handleAlertCreated} />
          </div>

          <div className="space-y-6 md:pl-8">
            <h2 className="text-xl font-semibold">My Alerts</h2>
            <AlertList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  )
}
