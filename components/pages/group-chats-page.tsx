"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { storage, type User, type GroupChat } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import GroupChatCard from "@/components/group-chat-card"
import GroupChatDetail from "@/components/group-chat-detail"
import { Plus } from 'lucide-react'

interface GroupChatsPageProps {
  currentUser: User
  selectedGroupChat: string | null
  onGroupChatSelect: (chatId: string | null) => void
}

export default function GroupChatsPage({ currentUser, selectedGroupChat, onGroupChatSelect }: GroupChatsPageProps) {
  const [groupChats, setGroupChats] = useState<GroupChat[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [chatType, setChatType] = useState<"public" | "private">("public")
  const [newChatName, setNewChatName] = useState("")
  const [newChatDesc, setNewChatDesc] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGroupChats = async () => {
      try {
        const response = await fetch('/api/group-chats')
        if (response.ok) {
          const data = await response.json()
          // Transform API response to match GroupChat interface
          const transformedChats = data.map((chat: any) => ({
            id: chat.id,
            name: chat.name,
            description: chat.description,
            isPrivate: chat.isPrivate,
            members: chat.members || [],
            messages: [],
            createdBy: chat.createdBy,
            createdAt: new Date(chat.createdAt).getTime()
          }))
          setGroupChats(transformedChats)
        }
      } catch (error) {
        console.error('Error fetching group chats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGroupChats()
  }, [])

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChatName.trim()) return

    try {
      const response = await fetch('/api/group-chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newChatName,
          description: newChatDesc,
          isPrivate: chatType === "private",
          userId: currentUser.id
        })
      })

      if (response.ok) {
        const { id } = await response.json()
        const newChat: GroupChat = {
          id,
          name: newChatName,
          description: newChatDesc,
          isPrivate: chatType === "private",
          members: [currentUser.id],
          messages: [],
          createdBy: currentUser.id,
          createdAt: Date.now(),
        }
        setGroupChats([...groupChats, newChat])
        setNewChatName("")
        setNewChatDesc("")
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Error creating group chat:', error)
    }
  }

  const handleJoinChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/group-chats/${chatId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      })

      if (response.ok) {
        setGroupChats(
          groupChats.map((chat) => {
            if (chat.id === chatId && !chat.members.includes(currentUser.id)) {
              return { ...chat, members: [...chat.members, currentUser.id] }
            }
            return chat
          }),
        )
      }
    } catch (error) {
      console.error('Error joining group chat:', error)
    }
  }

  if (selectedGroupChat) {
    const chat = groupChats.find((c) => c.id === selectedGroupChat)
    if (!chat) return null

    return (
      <GroupChatDetail
        chat={chat}
        currentUser={currentUser}
        onBack={() => onGroupChatSelect(null)}
        onChatUpdate={(updated) => {
          setGroupChats(groupChats.map((c) => (c.id === updated.id ? updated : c)))
        }}
      />
    )
  }

  const publicChats = groupChats.filter((c) => !c.isPrivate)
  const privateChats = groupChats.filter((c) => c.isPrivate)

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text">
            Group Chats
          </h2>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 glow-pulse"
          >
            <Plus className="w-4 h-4" />
            Create Chat
          </Button>
        </div>

        {showCreateForm && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 backdrop-blur-sm">
            <form onSubmit={handleCreateChat} className="space-y-3">
              <div className="flex gap-2 border-b border-border pb-3">
                <button
                  type="button"
                  onClick={() => setChatType("public")}
                  className={`px-4 py-2 font-medium transition-all relative ${chatType === "public" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Public
                  {chatType === "public" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full glow-pulse" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setChatType("private")}
                  className={`px-4 py-2 font-medium transition-all relative ${chatType === "private" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Private
                  {chatType === "private" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full glow-pulse" />
                  )}
                </button>
              </div>

              <Input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="Chat name"
                className="bg-input border-border text-foreground placeholder-muted-foreground"
                required
              />
              <textarea
                value={newChatDesc}
                onChange={(e) => setNewChatDesc(e.target.value)}
                placeholder="Chat description"
                className="w-full bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground p-2"
                rows={2}
              />
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Create
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-card"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading chats...</div>
        ) : (
          <div className="space-y-6">
            {publicChats.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  Public Group Chats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicChats.map((chat) => (
                    <GroupChatCard
                      key={chat.id}
                      chat={chat}
                      currentUser={currentUser}
                      onSelect={() => onGroupChatSelect(chat.id)}
                      onJoin={() => handleJoinChat(chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {privateChats.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-secondary to-primary rounded-full" />
                  Private Group Chats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {privateChats.map((chat) => (
                    <GroupChatCard
                      key={chat.id}
                      chat={chat}
                      currentUser={currentUser}
                      onSelect={() => onGroupChatSelect(chat.id)}
                      onJoin={() => handleJoinChat(chat.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupChats.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No group chats yet. Create one!</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
