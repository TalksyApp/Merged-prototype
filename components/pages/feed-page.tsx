"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { User } from "@/lib/storage"
import { Heart, MessageCircle, Share2, Zap, Plus, X } from "lucide-react"

interface FeedPageProps {
  currentUser: User
}

// ... existing interfaces ...
interface Post {
  id: string
  user_id: string
  username: string
  avatar_initials: string
  content: string
  tags: string[]
  is_promoted: boolean
  frequency_type: string
  created_at: string
  likes_count: number
}

export default function FeedPage({ currentUser }: FeedPageProps) {
  // ... existing state ...
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [showPostModal, setShowPostModal] = useState(false) // For the modal in screenshot

  // ... existing fetchPosts ...
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/get")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // ... existing handlePost ...
  const [isBoosted, setIsBoosted] = useState(false)

  // ... existing handlePost ...
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          content: content.trim(),
          tags: tagArray,
          frequencyType: isBoosted ? "high-voltage" : "standard",
          isPromoted: isBoosted,
        }),
      })

      if (response.ok) {
        setContent("")
        setTags("")
        setIsBoosted(false)
        setShowPostModal(false)
        await fetchPosts()
      }
    } catch (error) {
      console.error("Failed to create post:", error)
    }
  }

  // ... existing handleLike ...
  const handleLike = async (postId: string) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  return (
    <div className="w-full h-full relative">
      <div className="max-w-3xl mx-auto pt-10 px-4 pb-20">
        <h1 className="text-4xl font-black text-white mb-8 tracking-tight">Feed</h1>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading posts...</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`
                  relative rounded-[20px] p-6 transition-all duration-200
                  ${post.is_promoted ? "bg-[#0a0a0a] border border-[#FFD700]" : "bg-[#0a0a0a] border border-[#1f1f1f]"}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${post.is_promoted ? "bg-[#FFD700] text-black" : "bg-[#1f1f1f] text-white"}
                  `}
                  >
                    {post.avatar_initials || post.username[0]}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-lg">{post.username}</span>
                        <span className="text-blue-500 text-xs">●</span> {/* Verified badge placeholder */}
                        <span className="text-gray-500 text-sm">@{post.username.toLowerCase()} • 2h</span>
                      </div>

                      {post.is_promoted && (
                        <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full px-3 py-1 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
                          <span className="text-[10px] font-bold text-[#FFD700] tracking-wider">PROMOTED</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed mb-4 font-medium">{post.content}</p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex gap-2 mb-6">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#1f1f1f] text-gray-400 px-3 py-1 rounded-lg text-xs font-medium hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 text-gray-500 border-t border-[#1f1f1f] pt-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 hover:text-[#FFD700] transition-colors group"
                      >
                        <Heart
                          className={`w-5 h-5 ${likedPosts.has(post.id) ? "fill-[#FFD700] text-[#FFD700]" : "group-hover:scale-110"}`}
                        />
                        {/* Removed mock count */}
                      </button>

                      <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                        <MessageCircle className="w-5 h-5 group-hover:scale-110" />
                        {/* Removed mock count */}
                      </button>

                      <button className="flex items-center gap-2 hover:text-green-400 transition-colors group">
                        <Share2 className="w-5 h-5 group-hover:scale-110" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Posting */}
      <button
        onClick={() => setShowPostModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-white hover:bg-gray-200 text-black rounded-3xl flex items-center justify-center shadow-lg transition-all hover:scale-105 z-50"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Post Modal (matching screenshot) */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`bg-[#050505] border ${isBoosted ? 'border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.1)]' : 'border-[#1f1f1f]'} w-full max-w-lg rounded-[24px] p-6 relative shadow-2xl transition-all duration-300`}>
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              {isBoosted ? (
                <>
                  <Zap className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  <span className="text-[#FFD700] font-bold text-sm tracking-wider">HIGH VOLTAGE</span>
                </>
              ) : (
                <span className="text-white font-bold text-sm tracking-wider">TRANSMIT SIGNAL</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">{isBoosted ? "PRIORITY BROADCAST" : "STANDARD FREQUENCY"}</p>

            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-lg ${isBoosted ? 'bg-[#FFD700] text-black' : 'bg-[#1f1f1f] text-white'} flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors`}>
                {currentUser.avatar_initials || "U"}
              </div>

              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What is happening in the void?"
                  className="w-full bg-transparent text-lg text-white placeholder-gray-600 focus:outline-none resize-none min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 mb-6">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="#Tag (e.g. Design)"
                className="bg-[#121212] border border-[#1f1f1f] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700]/50 w-full"
              />
              <button className="bg-white text-black text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-200">
                Add
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-4">
              <button
                onClick={() => setIsBoosted(!isBoosted)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${isBoosted ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'}`}
              >
                <Zap className={`w-3 h-3 ${isBoosted ? 'fill-black' : 'fill-gray-400'}`} />
                {isBoosted ? "BOOST ACTIVE" : "Boost"}
              </button>

              <button
                onClick={handlePost}
                className="bg-[#1a1a1a] text-white px-6 py-2 rounded-full font-medium hover:bg-[#2a2a2a] transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
