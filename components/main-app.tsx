"use client"

import { useState } from "react"
import type { User } from "@/lib/storage"
import Navigation from "@/components/navigation"
import FeedPage from "@/components/pages/feed-page"
import ExplorePage from "@/components/pages/explore-page"
import GroupChatsPage from "@/components/pages/group-chats-page"
import ProfilePage from "@/components/pages/profile-page"

// Simple Settings Placeholder to prevent errors since it was removed
function SettingsPage() {
  return <div className="p-8 text-center text-muted-foreground">Settings Page</div>
}

interface MainAppProps {
  currentUser: User
  onUserUpdate: (user: User) => void
}

export default function MainApp({ currentUser, onUserUpdate }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState<"feed" | "explore" | "groups" | "profile" | "settings">("feed")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background flex flex-row">
      {/* Sidebar Navigation */}
      <Navigation currentUser={currentUser} currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content Area - Offset by sidebar width */}
      <main className="flex-1 ml-[100px] overflow-hidden">
        {currentPage === "feed" && <FeedPage currentUser={currentUser} />}
        {currentPage === "explore" && (
          <ExplorePage currentUser={currentUser} selectedTopic={selectedTopic} onTopicSelect={setSelectedTopic} />
        )}
        {/* Keeping groups for functionality even if not in screenshots */}
        {currentPage === "groups" && (
          <GroupChatsPage
            currentUser={currentUser}
            selectedGroupChat={selectedGroupChat}
            onGroupChatSelect={setSelectedGroupChat}
          />
        )}
        {currentPage === "profile" && <ProfilePage currentUser={currentUser} onUserUpdate={onUserUpdate} />}
        {currentPage === "settings" && <SettingsPage />}

        {/* Mobile/Floating Chat Button (seen in screenshots top right) */}
        <div className="fixed top-6 right-6 z-50">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </main>
    </div>
  )
}
