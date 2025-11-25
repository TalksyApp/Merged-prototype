"use client"

import type { User } from "@/lib/storage"
import { Home, Compass, Bell, UserIcon, Settings } from "lucide-react"

interface NavigationProps {
  currentUser: User
  currentPage: string
  onPageChange: (page: "feed" | "explore" | "groups" | "profile" | "settings") => void
}

export default function Navigation({ currentUser, currentPage, onPageChange }: NavigationProps) {
  // Navigation items matching the screenshot icons exactly: Home, Compass, Bell, User, Settings
  const navItems = [
    { id: "feed", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "notifications", label: "Notifications", icon: Bell }, // Placeholder for Bell
    { id: "profile", label: "Profile", icon: UserIcon },
  ]

  return (
    <nav className="h-full w-full flex flex-col items-center py-6 bg-background">
      {/* Sidebar Container */}
      <div className="flex-1 flex flex-col items-center gap-6 bg-[#0a0a0a] rounded-full px-2 py-6 border border-[#1f1f1f] w-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as any)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 group ${isActive
                  ? "bg-[#1f1f1f] text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  : "text-gray-500 hover:text-white"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-2" : "stroke-[1.5px]"}`} />
            </button>
          )
        })}

        <div className="mt-auto">
          <button
            onClick={() => onPageChange("settings" as any)} // Assuming settings is a page
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${currentPage === "settings" ? "bg-[#1f1f1f] text-white" : "text-gray-500 hover:text-white"
              }`}
          >
            <Settings className="w-5 h-5 stroke-[1.5px]" />
          </button>
        </div>
      </div>
    </nav>
  )
}
