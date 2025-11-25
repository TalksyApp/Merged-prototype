"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import type { User } from "@/lib/storage"
import Navigation from "@/components/navigation"
import FeedPage from "@/components/pages/feed-page"
import ExplorePage from "@/components/pages/explore-page"
import GroupChatsPage from "@/components/pages/group-chats-page"
import ProfilePage from "@/components/pages/profile-page"
import MessagesOverlay from "@/components/messages-overlay"

import SettingsPage from "@/components/pages/settings-page"
import MessagesPage from "@/components/pages/messages-page"

interface MainAppProps {
  currentUser: User
  onUserUpdate: (user: User) => void
}

export default function MainApp({ currentUser, onUserUpdate }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState<"feed" | "explore" | "groups" | "profile" | "settings" | "messages">("feed")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null)
  const [showMessages, setShowMessages] = useState(false)

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar Navigation - Fixed width */}
      <div className="w-[80px] flex-shrink-0 border-r border-white/10">
        <Navigation currentUser={currentUser} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* Main Content Area - Flexible width */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto w-full">
          {currentPage === "feed" && <FeedPage currentUser={currentUser} />}
          {currentPage === "explore" && (
            <ExplorePage
              currentUser={currentUser}
              selectedTopic={selectedTopic}
              onTopicSelect={setSelectedTopic}
              onNavigateToGroups={() => setCurrentPage("groups")}
            />
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
          {currentPage === "settings" && (
            <SettingsPage
              currentUser={currentUser}
              onNavigate={(page) => setCurrentPage(page as any)}
              onLogout={() => {
                window.location.reload()
              }}
            />
          )}
          {currentPage === "messages" && <MessagesPage />}
        </div>

        {/* Mobile/Floating Chat Button */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setCurrentPage("messages")}
            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg"
          >
            <MessageCircle size={20} />
          </button>
        </div>

        {/* Messages Overlay */}
        {showMessages && (
          <MessagesOverlay currentUser={currentUser} onClose={() => setShowMessages(false)} />
        )}
      </main>

      {/* Debug Indicator - Remove before production */}
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded z-[100] font-bold">
        <span className="block sm:hidden">XS</span>
        <span className="hidden sm:block md:hidden">SM</span>
        <span className="hidden md:block lg:hidden">MD</span>
        <span className="hidden lg:block xl:hidden">LG</span>
        <span className="hidden xl:block xl:hidden">XL</span>
      </div>
    </div>
  )
}
