"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import FeedPage from "@/components/pages/feed-page"
import type { User } from "@/lib/storage"

export default function Home() {
  const { data: session } = useSession()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`)
          if (response.ok) {
            const userData = await response.json()
            setCurrentUser(userData)
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (session?.user) {
      fetchUserData()
    }
  }, [session?.user])

  if (!session?.user) return null
  if (loading) return <div className="flex items-center justify-center h-full text-white">Loading...</div>
  if (!currentUser) return null

  return <FeedPage currentUser={currentUser} />
}
