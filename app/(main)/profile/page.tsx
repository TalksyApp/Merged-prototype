"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import ProfilePage from "@/components/pages/profile-page"

export default function Profile() {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user as any)

  if (!session?.user) return null

  return (
    <ProfilePage
      currentUser={user || session.user as any}
      onUserUpdate={setUser}
    />
  )
}
