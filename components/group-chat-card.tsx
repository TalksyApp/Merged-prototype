"use client"

import type { GroupChat, User } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Users, Lock } from "lucide-react"

interface GroupChatCardProps {
  chat: GroupChat
  currentUser: User
  onSelect: () => void
  onJoin: () => void
}

export default function GroupChatCard({ chat, currentUser, onSelect, onJoin }: GroupChatCardProps) {
  const isMember = chat.members.includes(currentUser.id)

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 hover-lift transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer slide-up"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex-1">
          {chat.name}
        </h3>
        {chat.isPrivate && <Lock className="w-4 h-4 text-secondary flex-shrink-0 ml-2" />}
      </div>
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{chat.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Users className="w-4 h-4 text-primary" />
          {chat.members.length} members
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            if (!isMember) onJoin()
          }}
          className={`transition-all ${
            isMember
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-pulse"
          }`}
          size="sm"
        >
          {isMember ? "Joined" : "Join"}
        </Button>
      </div>
    </div>
  )
}
