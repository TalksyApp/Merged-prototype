"use client"

import { useEffect, useState } from "react"
import type { Session } from "@/lib/auth"
import { getSession } from "@/lib/auth"
import type { User } from "@/lib/storage"
import MainApp from "@/components/main-app"
import AuthPage from "@/components/auth-page"

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = await getSession()
      setSession(currentSession)
      if (currentSession?.user) {
        setCurrentUser(currentSession.user)
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  const handleUserCreated = (user: User) => {
    setCurrentUser(user)
    setSession({
      user: user,
      isAuthenticated: true,
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">TALKSY</div>
          <div className="text-foreground/60">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return <AuthPage onUserCreated={handleUserCreated} />
  }

  return (
    <div className="flex h-screen bg-background">
      <MainApp currentUser={currentUser || session.user} onUserUpdate={() => {}} />
    </div>
  )
}
