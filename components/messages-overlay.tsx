"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search, Camera, Smile, Send } from "lucide-react"
import type { User } from "@/lib/storage"

interface MessagesOverlayProps {
  currentUser: User
  onClose: () => void
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isMe: boolean
}

interface ChatUser {
  id: string
  username: string
  handle: string
  avatar_initials: string
  status: "online" | "offline"
  lastMessage: string
  lastMessageTime: string
  color: string
}

export default function MessagesOverlay({ currentUser, onClose }: MessagesOverlayProps) {
  const [activeChat, setActiveChat] = useState<string>("1")
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "1",
      text: "Yo! The new profile update looks sick.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isMe: false,
    },
    {
      id: "2",
      senderId: "me",
      text: "Thanks! I removed the follower counts.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      isMe: true,
    },
    {
      id: "3",
      senderId: "1",
      text: "Smart move. Pure vibes only.",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isMe: false,
    },
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const users: ChatUser[] = [
    {
      id: "1",
      username: "Design_God",
      handle: "@visuals_online",
      avatar_initials: "D",
      status: "online",
      lastMessage: "Did you see the new layout?",
      lastMessageTime: "2m",
      color: "bg-purple-600",
    },
    {
      id: "2",
      username: "Neon_Rider",
      handle: "@neon_rider",
      avatar_initials: "N",
      status: "offline",
      lastMessage: "The grid is quiet tonight.",
      lastMessageTime: "1h",
      color: "bg-blue-600",
    },
    {
      id: "3",
      username: "System_Bot",
      handle: "@sys_bot",
      avatar_initials: "S",
      status: "online",
      lastMessage: "Welcome to Talksy Void.",
      lastMessageTime: "1d",
      color: "bg-green-600",
    },
  ]

  const activeUser = users.find((u) => u.id === activeChat)

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: messageInput,
      timestamp: new Date(),
      isMe: true,
    }

    setMessages([...messages, newMessage])
    setMessageInput("")
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="bg-[#050505] border border-[#1f1f1f] w-full max-w-6xl h-[80vh] rounded-[24px] flex overflow-hidden shadow-2xl">
        
        {/* Sidebar - User List */}
        <div className="w-1/3 border-r border-[#1f1f1f] flex flex-col bg-[#0a0a0a]">
          <div className="p-6">
            <h2 className="text-2xl font-black text-white mb-6">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#121212] border border-[#1f1f1f] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#333]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div 
                key={user.id}
                onClick={() => setActiveChat(user.id)}
                className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${activeChat === user.id ? 'bg-[#1a1a1a]' : 'hover:bg-[#121212]'}`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${activeChat === user.id ? 'bg-[#333]' : 'bg-[#1f1f1f]'}`}>
                    {user.avatar_initials}
                  </div>
                  {user.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold truncate ${activeChat === user.id ? 'text-white' : 'text-gray-300'}`}>{user.username}</h3>
                    <span className="text-xs text-gray-600">{user.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#050505] relative">
          {/* Chat Header */}
          <div className="p-6 border-b border-[#1f1f1f] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-purple-600`}>
                {activeUser?.avatar_initials}
              </div>
              <div>
                <h3 className="font-bold text-white">{activeUser?.username}</h3>
                <p className="text-xs text-gray-500">{activeUser?.handle}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center text-white hover:bg-[#333] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed
                    ${msg.isMe 
                      ? 'bg-[#6366f1] text-white rounded-tr-sm' 
                      : 'bg-[#1f1f1f] text-gray-200 rounded-tl-sm'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-[#1f1f1f]">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3 text-gray-500">
                <button type="button" className="hover:text-white transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Message..."
                className="w-full bg-[#121212] border border-[#1f1f1f] rounded-full py-4 pl-14 pr-14 text-white placeholder-gray-600 focus:outline-none focus:border-[#333]"
              />

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                 {messageInput.trim() ? (
                    <button type="submit" className="text-[#6366f1] hover:text-[#818cf8] transition-colors">
                      <Send className="w-5 h-5" />
                    </button>
                 ) : (
                    <button type="button" className="text-gray-500 hover:text-white transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                 )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
