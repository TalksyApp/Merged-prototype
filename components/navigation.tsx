"use client"

import type { User } from "@/lib/storage"
import { Home, Compass, Bell, UserIcon, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationProps {
  currentUser: User
}

export default function Navigation({ currentUser }: NavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { id: "feed", label: "Home", icon: Home, href: "/" },
    { id: "explore", label: "Explore", icon: Compass, href: "/explore" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/notifications" },
    { id: "profile", label: "Profile", icon: UserIcon, href: "/profile" },
  ]

  return (
    <nav className="h-full w-full flex flex-col items-center py-6 bg-background">
      <div className="flex-1 flex flex-col items-center gap-6 bg-[#0a0a0a] rounded-full px-2 py-6 border border-[#1f1f1f] w-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 group ${
                isActive
                  ? "bg-[#1f1f1f] text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-2" : "stroke-[1.5px]"}`} />
            </Link>
          )
        })}

        <div className="mt-auto">
          <Link
            href="/settings"
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              pathname === "/settings" ? "bg-[#1f1f1f] text-white" : "text-gray-500 hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5 stroke-[1.5px]" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
