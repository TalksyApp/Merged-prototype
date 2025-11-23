"use client"

import type { Topic, User } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface TopicCardProps {
  topic: Topic
  currentUser: User
  onSelect: () => void
  onJoin: () => void
}

export default function TopicCard({ topic, currentUser, onSelect, onJoin }: TopicCardProps) {
  const isMember = topic.members.includes(currentUser.id)

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 hover-lift transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer slide-up"
      onClick={onSelect}
    >
      <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        {topic.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{topic.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Users className="w-4 h-4 text-primary" />
          {topic.members.length} members
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
