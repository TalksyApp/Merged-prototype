"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { storage, type User, type Post } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import PostCard from "@/components/post-card"
import { Send } from 'lucide-react'

interface FeedPageProps {
  currentUser: User
}

export default function FeedPage({ currentUser }: FeedPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const allPosts = storage.getPosts()
    setPosts(allPosts.sort((a, b) => b.timestamp - a.timestamp))
    setIsLoading(false)
  }, [])

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: content.trim(),
      timestamp: Date.now(),
      likes: [],
      replies: [],
    }

    storage.addPost(newPost)
    setPosts([newPost, ...posts])
    setContent("")
  }

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser.id)
          return {
            ...post,
            likes: isLiked ? post.likes.filter((id) => id !== currentUser.id) : [...post.likes, currentUser.id],
          }
        }
        return post
      }),
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full p-4">
        <form onSubmit={handlePost} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 font-semibold text-card">
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 glow-pulse disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Post
            </Button>
          </div>
        </form>
      </div>

      <div className="w-full p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No posts yet. Be the first to post!</div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} />)
        )}
      </div>
    </div>
  )
}
