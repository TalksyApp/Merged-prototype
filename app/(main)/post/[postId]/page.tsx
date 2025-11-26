"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import PostDetail from "@/components/post-detail"
import type { User } from "@/lib/storage"

export default function PostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user data
        if (session?.user?.id) {
          const userResponse = await fetch(`/api/users/${session.user.id}`)
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setCurrentUser(userData)
          }
        }

        // Fetch post data
        const postId = params.postId as string
        const postResponse = await fetch(`/api/posts/${postId}`)
        if (postResponse.ok) {
          const data = await postResponse.json()
          setPost({
            id: data.id,
            userId: data.user_id,
            content: data.content,
            timestamp: new Date(data.created_at).getTime(),
            likes: data.likes_count || 0,
            replies: [],
            comments: data.comments_count || 0,
            author: data.username,
            handle: `@${data.username}`,
            avatar: data.avatar_initials || data.username[0],
            tags: data.tags || [],
            isBoosted: data.is_boosted || false
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.postId && session?.user) {
      fetchData()
    }
  }, [params.postId, session?.user])

  if (!session?.user) return null
  if (loading) return <div className="flex items-center justify-center h-full text-white">Loading...</div>
  if (!post || !currentUser) return <div className="flex items-center justify-center h-full text-white">Post not found</div>

  const handleLike = async (postId: string) => {
    if (!post || !currentUser) return

    // Optimistic update - update UI immediately
    const currentLikes = typeof post.likes === 'number' ? post.likes : 0
    const isCurrentlyLiked = post.isLikedByUser
    const optimisticPost = {
      ...post,
      likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
      isLikedByUser: !isCurrentlyLiked
    }
    setPost(optimisticPost)

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      })

      if (!response.ok) {
        // Revert on error
        setPost(post)
      }
    } catch (error) {
      console.error('Error liking post:', error)
      // Revert on error
      setPost(post)
    }
  }

  return (
    <PostDetail
      post={post}
      currentUser={currentUser}
      onBack={() => router.back()}
      onLike={handleLike}
    />
  )
}
