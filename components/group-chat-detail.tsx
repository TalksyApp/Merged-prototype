"use client"

import React, { useState } from "react"
import { type GroupChat, type User, type ChatMessage } from "@/lib/storage"
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
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageContent, setMessageContent] = useState("")
  const [isMember, setIsMember] = useState(chat.members.includes(currentUser.id))
  const [users, setUsers] = useState<User[]>([])

  // Fetch messages and users
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesRes, usersRes] = await Promise.all([
          fetch(`/api/group-chats/${chat.id}/messages`),
          fetch('/api/users')
        ])
        
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json()
          setMessages(messagesData)
        }
        
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setUsers(usersData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [chat.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim() || !isMember) return

    try {
      const response = await fetch(`/api/group-chats/${chat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageContent.trim(),
          userId: currentUser.id
        })
      })

      if (response.ok) {
        const { id } = await response.json()
        const newMessage: ChatMessage = {
          id,
          userId: currentUser.id,
          content: messageContent.trim(),
          timestamp: Date.now(),
        }
        setMessages([...messages, newMessage])
        setMessageContent("")
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleJoin = async () => {
    try {
      const response = await fetch(`/api/group-chats/${chat.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      })

      if (response.ok) {
        setIsMember(true)
        const updatedChat = { ...chat, members: [...chat.members, currentUser.id] }
        onChatUpdate(updatedChat)
      }
    } catch (error) {
      console.error('Error joining chat:', error)
    }
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
          messages.map((msg: any) => {
            const author = users.find((u) => u.id === msg.userId)
            const username = msg.username || author?.username || 'Unknown'
            const avatar = msg.avatar_initials || author?.avatar_initials || username[0]
            const timestamp = msg.timestamp || new Date(msg.created_at).getTime()
            
            return (
              <div key={msg.id} className="flex gap-3 slide-up">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 font-semibold text-card text-xs">
                  {avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">@{username}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
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
