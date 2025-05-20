"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/supabase/database.types"

type Alert = Database["public"]["Tables"]["alerts"]["Row"] & {
  courses: { id: number; name: string }[]
}

interface AlertCardProps {
  alert: Alert
  onUpdate: () => void
}

export function AlertCard({ alert, onUpdate }: AlertCardProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleActive = async () => {
    setIsUpdating(true)
    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("alerts").update({ is_active: !alert.is_active }).eq("id", alert.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Alert ${alert.is_active ? "deactivated" : "activated"} successfully`,
      })

      onUpdate()
    } catch (error) {
      console.error("Error updating alert:", error)
      toast({
        title: "Error",
        description: "Failed to update alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Format the time for display
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":")
      const hour = Number.parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const hour12 = hour % 12 || 12
      return `${hour12}:${minutes} ${ampm}`
    } catch (e) {
      return timeString
    }
  }

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card
      className={`overflow-hidden border-l-4 ${alert.is_active ? "border-l-primary" : "border-l-muted opacity-70"}`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {alert.courses.map((course) => (
              <Badge key={course.id} variant="secondary" className="bg-primary/10">
                {course.name}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-secondary/50 p-2 rounded-md">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(alert.alert_date)}</p>
            </div>
            <div className="bg-secondary/50 p-2 rounded-md">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium">
                {formatTime(alert.start_time)} - {formatTime(alert.end_time)}
              </p>
            </div>
            <div className="bg-secondary/50 p-2 rounded-md col-span-2">
              <p className="text-xs text-muted-foreground">Players</p>
              <p className="font-medium">
                {alert.players} {alert.players === 1 ? "player" : "players"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button
          variant={alert.is_active ? "outline" : "default"}
          size="default"
          onClick={toggleActive}
          disabled={isUpdating}
          className="min-w-[120px]"
        >
          {isUpdating ? "Updating..." : alert.is_active ? "Deactivate" : "Activate"}
        </Button>
      </CardFooter>
    </Card>
  )
}
