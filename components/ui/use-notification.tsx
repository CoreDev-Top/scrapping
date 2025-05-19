"use client"

import * as React from "react"
import { Notification } from "./notification"

type NotificationType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

type NotificationContextType = {
  notifications: NotificationType[]
  addNotification: (notification: Omit<NotificationType, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationType[]>([])

  const addNotification = React.useCallback((notification: Omit<NotificationType, "id">) => {
    const id = Math.random().toString(36).substring(7)
    setNotifications((prev) => [...prev, { ...notification, id }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }, [])

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            title={notification.title}
            description={notification.description}
            variant={notification.variant}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
} 