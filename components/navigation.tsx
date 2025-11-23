"use client"

import type { User } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { MessageCircle, Compass, Users, UserIcon, LogOut, Zap } from 'lucide-react'

interface NavigationProps {
  currentUser: User
  currentPage: string
  onPageChange: (page: "feed" | "explore" | "groups" | "profile") => void
}

export default function Navigation({ currentUser, currentPage, onPageChange }: NavigationProps) {
  const handleLogout = () => {
    localStorage.removeItem("talksy_current_user")
    window.location.reload()
  }

  const navItems = [
    { id: "feed", label: "Feed", icon: MessageCircle },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "groups", label: "Groups", icon: Users },
    { id: "profile", label: "Profile", icon: UserIcon },
  ]

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 w-full">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary glow-pulse" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TALKSY
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">@{currentUser.username}</span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative group ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full glow-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
