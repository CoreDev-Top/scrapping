"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { AlertCard } from "./alert-card"
import type { Database } from "@/lib/supabase/database.types"

type Alert = Database["public"]["Tables"]["alerts"]["Row"] & {
  courses: { id: number; name: string }[]
}

export function AlertList({ refreshTrigger }: { refreshTrigger: number }) {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase.from("courses").select("id, name")

        if (error) throw error
        setCourses(data || [])
      } catch (error) {
        console.error("Error fetching courses:", error)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return

      setLoading(true)
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        // Add course names to alerts
        const alertsWithCourses =
          data?.map((alert) => ({
            ...alert,
            courses: alert.course_ids.map(
              (id) => courses.find((course) => course.id === id) || { id, name: `Course ${id}` },
            ),
          })) || []

        setAlerts(alertsWithCourses)
      } catch (error) {
        console.error("Error fetching alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    if (courses.length > 0) {
      fetchAlerts()
    }
  }, [user, courses, refreshTrigger])

  const handleAlertUpdate = () => {
    // Refetch alerts when an alert is updated
    const fetchAlerts = async () => {
      if (!user) return

      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        // Add course names to alerts
        const alertsWithCourses =
          data?.map((alert) => ({
            ...alert,
            courses: alert.course_ids.map(
              (id) => courses.find((course) => course.id === id) || { id, name: `Course ${id}` },
            ),
          })) || []

        setAlerts(alertsWithCourses)
      } catch (error) {
        console.error("Error fetching alerts:", error)
      }
    }

    fetchAlerts()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white/50 backdrop-blur-sm rounded-lg border">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"></path>
              <circle cx="18" cy="18" r="3"></circle>
              <path d="M18 14v1"></path>
              <path d="M18 21v1"></path>
              <path d="M22 18h-1"></path>
              <path d="M15 18h-1"></path>
            </svg>
          </div>
          <p className="text-lg font-medium">No alerts yet</p>
          <p className="text-muted-foreground">Create your first alert to get notified about tee times</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} onUpdate={handleAlertUpdate} />
      ))}
    </div>
  )
}
