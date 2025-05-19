"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const supabase = getSupabase()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        if (data?.session?.user) {
          router.push("/dashboard")
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return null
}
