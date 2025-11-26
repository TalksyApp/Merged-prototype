"use client"

import { useSession } from "next-auth/react"
import MessagesPage from "@/components/pages/messages-page"

export default function Chat() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return <MessagesPage />
}
