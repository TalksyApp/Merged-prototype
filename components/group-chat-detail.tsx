"use client"

import type React from "react"

import { useState } from "react"
import { storage, type GroupChat, type User, type ChatMessage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface GroupChatDetailProps {
  chat: GroupChat
  currentUser: User
  onBack: () => void
  onChatUpdate: (chat: GroupChat) => void
}

export default function GroupChatDetail({ chat, currentUser, onBack, onChatUpdate }: GroupChatDetailProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(chat.messages)
  const [messageContent, setMessageContent] = useState("")
  const [isMember, setIsMember] = useState(chat.members.includes(currentUser.id))

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim() || !isMember) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: messageContent.trim(),
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setMessageContent("")

    const updatedChat = { ...chat, messages: updatedMessages }
    storage.updateGroupChat(chat.id, updatedChat)
    onChatUpdate(updatedChat)
  }

  const handleJoin = () => {
    const updatedChat = { ...chat, members: [...chat.members, currentUser.id] }
    storage.updateGroupChat(chat.id, updatedChat)
    setIsMember(true)
    onChatUpdate(updatedChat)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card border-b border-border p-4 flex-shrink-0 backdrop-blur-sm bg-opacity-95">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
          {chat.name}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{chat.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const author = storage.getUsers().find((u) => u.id === msg.userId)
            if (!author) return null
            return (
              <div key={msg.id} className="flex gap-3 slide-up">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 font-semibold text-card text-xs">
                  {author.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">@{author.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{msg.content}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="bg-card border-t border-border p-4 flex-shrink-0 backdrop-blur-sm bg-opacity-95">
        {!isMember ? (
          <Button
            onClick={handleJoin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-pulse"
          >
            Join Chat
          </Button>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type a message..."
              className="bg-input border-border text-foreground placeholder-muted-foreground"
            />
            <Button
              type="submit"
              disabled={!messageContent.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 glow-pulse disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
