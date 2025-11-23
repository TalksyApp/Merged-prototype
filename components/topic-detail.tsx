"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { storage, type Topic, type User, type Post } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PostCard from "@/components/post-card"
import { ArrowLeft, Send } from "lucide-react"

interface TopicDetailProps {
  topic: Topic
  currentUser: User
  onBack: () => void
}

export default function TopicDetail({ topic, currentUser, onBack }: TopicDetailProps) {
  const [content, setContent] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [isMember, setIsMember] = useState(topic.members.includes(currentUser.id))

  useEffect(() => {
    const allPosts = storage.getPosts()
    const topicPosts = allPosts.filter((p) => topic.posts.includes(p.id))
    setPosts(topicPosts.sort((a, b) => b.timestamp - a.timestamp))
  }, [topic])

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !isMember) return

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: content.trim(),
      timestamp: Date.now(),
      likes: [],
      replies: [],
    }

    storage.addPost(newPost)
    const updatedTopic = { ...topic, posts: [...topic.posts, newPost.id] }
    const topics = storage.getTopics()
    const index = topics.findIndex((t) => t.id === topic.id)
    if (index !== -1) {
      topics[index] = updatedTopic
      localStorage.setItem("talksy_topics", JSON.stringify(topics))
    }

    setPosts([newPost, ...posts])
    setContent("")
  }

  const handleJoin = () => {
    const updatedTopic = { ...topic, members: [...topic.members, currentUser.id] }
    const topics = storage.getTopics()
    const index = topics.findIndex((t) => t.id === topic.id)
    if (index !== -1) {
      topics[index] = updatedTopic
      localStorage.setItem("talksy_topics", JSON.stringify(topics))
    }
    setIsMember(true)
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
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 z-40 backdrop-blur-sm bg-opacity-95">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Button>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            {topic.name}
          </h2>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{topic.description}</p>

          {!isMember ? (
            <Button
              onClick={handleJoin}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-pulse"
            >
              Join Topic
            </Button>
          ) : (
            <form onSubmit={handlePost} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="bg-input border-border text-foreground placeholder-muted-foreground"
                />
                <Button
                  type="submit"
                  disabled={!content.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 glow-pulse disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Post
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="p-4 space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No posts in this topic yet.</div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} />)
          )}
        </div>
      </div>
    </div>
  )
}
