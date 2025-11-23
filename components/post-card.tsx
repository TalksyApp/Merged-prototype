"use client"

import type React from "react"

import { useState } from "react"
import { storage, type User, type Post } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: Post
  currentUser: User
  onLike: (postId: string) => void
}

export default function PostCard({ post, currentUser, onLike }: PostCardProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState<any[]>([])

  const author = storage.getUsers().find((u) => u.id === post.userId)
  const isLiked = post.likes.includes(currentUser.id)

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    const newReply = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: replyContent,
      timestamp: Date.now(),
    }

    setReplies([...replies, newReply])
    setReplyContent("")
  }

  const handleDelete = () => {
    const posts = storage.getPosts()
    const filtered = posts.filter((p) => p.id !== post.id)
    localStorage.setItem("talksy_posts", JSON.stringify(filtered))
    window.location.reload()
  }

  if (!author) return null

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover-lift transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 slide-up">
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 font-semibold text-card">
          {author.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">@{author.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(post.timestamp, { addSuffix: true })}
              </p>
            </div>
            {post.userId === currentUser.id && (
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

      <div className="flex gap-4 mb-3 text-muted-foreground text-sm">
        <Button
          onClick={() => onLike(post.id)}
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 transition-colors ${
            isLiked ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          {post.likes.length}
        </Button>
        <Button
          onClick={() => setShowReplies(!showReplies)}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {replies.length}
        </Button>
      </div>

      {showReplies && (
        <div className="border-t border-border pt-3 mt-3">
          <form onSubmit={handleReply} className="mb-3 flex gap-2">
            <Input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Reply..."
              className="bg-input border-border text-foreground placeholder-muted-foreground text-sm"
            />
            <Button
              type="submit"
              disabled={!replyContent.trim()}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Reply
            </Button>
          </form>

          <div className="space-y-2">
            {replies.map((reply) => {
              const replyAuthor = storage.getUsers().find((u) => u.id === reply.userId)
              if (!replyAuthor) return null
              return (
                <div key={reply.id} className="bg-input rounded-lg p-2 text-sm">
                  <p className="font-semibold text-foreground">@{replyAuthor.username}</p>
                  <p className="text-muted-foreground">{reply.content}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
