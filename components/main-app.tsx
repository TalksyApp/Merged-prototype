"use client"

import { useState } from "react"
import type { User } from "@/lib/storage"
import Navigation from "@/components/navigation"
import FeedPage from "@/components/pages/feed-page"
import ExplorePage from "@/components/pages/explore-page"
import GroupChatsPage from "@/components/pages/group-chats-page"
import ProfilePage from "@/components/pages/profile-page"

interface MainAppProps {
  currentUser: User
  onUserUpdate: (user: User) => void
}

export default function MainApp({ currentUser, onUserUpdate }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState<"feed" | "explore" | "groups" | "profile">("feed")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col w-full">
      <Navigation currentUser={currentUser} currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="flex-1 overflow-hidden">
        {currentPage === "feed" && <FeedPage currentUser={currentUser} />}
        {currentPage === "explore" && (
          <ExplorePage currentUser={currentUser} selectedTopic={selectedTopic} onTopicSelect={setSelectedTopic} />
        )}
        {currentPage === "groups" && (
          <GroupChatsPage
            currentUser={currentUser}
            selectedGroupChat={selectedGroupChat}
            onGroupChatSelect={setSelectedGroupChat}
          />
        )}
        {currentPage === "profile" && <ProfilePage currentUser={currentUser} onUserUpdate={onUserUpdate} />}
      </main>
    </div>
  )
}
