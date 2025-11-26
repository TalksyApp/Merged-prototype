"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@/lib/storage"
import Navigation from "@/components/navigation"
import { MessageCircle, X } from "lucide-react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [status, router])

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

    if (status === "authenticated") {
      fetchUserData()
    }
  }, [session, status])

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">TALKSY</div>
          <div className="text-foreground/60">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session?.user || !currentUser) {
    return null
  }

  // Show chat button only on main feed page
  const showChatButton = pathname === "/"
  const isOnChatPage = pathname === "/chat"

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <div className="w-[80px] flex-shrink-0 border-r border-white/10">
        <Navigation currentUser={currentUser} />
      </div>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>

        {showChatButton && (
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={() => router.push("/chat")}
              className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        )}

        {isOnChatPage && (
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={() => router.push("/")}
              className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </main>

      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded z-[100] font-bold">
        <span className="block sm:hidden">XS</span>
        <span className="hidden sm:block md:hidden">SM</span>
        <span className="hidden md:block lg:hidden">MD</span>
        <span className="hidden lg:block xl:hidden">LG</span>
        <span className="hidden xl:block">XL</span>
      </div>
    </div>
  )
}
