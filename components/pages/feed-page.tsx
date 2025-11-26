"use client"

import React, { useState, useEffect } from 'react';
import PostCard from '@/components/post-card';
import CreateModal from '@/components/create-modal';
import UserPopup from '@/components/user-popup';
import { storage, type User, type Post } from "@/lib/storage"
import { Plus, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPostsCache, setPostsCache, updatePostInCache, invalidatePostsCache } from '@/lib/posts-cache';

interface FeedPageProps {
  currentUser: User
}

export default function FeedPage({ currentUser }: FeedPageProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [topic, setTopic] = useState<string | null>(null) // Feed is general for now
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      // Check cache first
      const cachedPosts = getPostsCache()
      if (cachedPosts) {
        setPosts(cachedPosts)
        return
      }

      try {
        const response = await fetch(`/api/posts?userId=${currentUser.id}`)
        if (response.ok) {
          const data = await response.json()
          // Transform API response to match Post interface
          const transformedPosts = data.map((post: any) => ({
            id: post.id,
            userId: post.user_id || '',
            content: post.content,
            timestamp: new Date(post.created_at).getTime(),
            likes: post.likes_count || 0,
            replies: [],
            comments: post.comments_count || 0,
            author: post.username,
            handle: `@${post.username}`,
            avatar: post.avatar_initials || post.username[0],
            tags: post.tags || [],
            isBoosted: post.is_boosted || false,
            isLikedByUser: post.is_liked_by_user || false
          }))
          setPosts(transformedPosts)
          setPostsCache(transformedPosts)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    
    fetchPosts()
  }, [currentUser.id])

  const handleLike = async (postId: string) => {
    // Optimistic update - update UI immediately
    const optimisticPosts = posts.map(post => {
      if (post.id === postId) {
        const currentLikes = typeof post.likes === 'number' ? post.likes : (post.likes as any).length || 0
        const isCurrentlyLiked = (post as any).isLikedByUser
        return {
          ...post,
          likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          isLikedByUser: !isCurrentlyLiked
        } as any
      }
      return post
    })
    setPosts(optimisticPosts)

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      })

      if (response.ok) {
        const { liked } = await response.json()
        // Update cache with server response
        const post = posts.find(p => p.id === postId)
        if (post) {
          const currentLikes = typeof post.likes === 'number' ? post.likes : (post.likes as any).length || 0
          updatePostInCache(postId, { 
            likes: liked ? currentLikes + 1 : Math.max(0, currentLikes - 1), 
            isLikedByUser: liked 
          })
        }
      } else {
        // Revert on error
        setPosts(posts)
      }
    } catch (error) {
      console.error('Error liking post:', error)
      // Revert on error
      setPosts(posts)
    }
  }

  const handlePost = async (text: string, tags: string[], options: { isBoosted: boolean }) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          userId: currentUser.id,
          tags: tags,
          isBoosted: options.isBoosted
        })
      })

      if (response.ok) {
        const { id } = await response.json()
        const newPost: Post = {
          id,
          userId: currentUser.id,
          content: text,
          timestamp: Date.now(),
          likes: [],
          replies: [],
          // @ts-ignore - extending Post type locally for now
          tags: tags,
          isBoosted: options.isBoosted,
          author: currentUser.username,
          handle: `@${currentUser.username.toLowerCase()}`,
          avatar: currentUser.avatar_initials || currentUser.username[0]
        }
        setPosts([newPost, ...posts])
        // Invalidate cache since we added a new post
        invalidatePostsCache()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  };

  // Don't show detail view here - let routing handle it

  return (
    <>
      <div className="w-full pt-10 pb-32 px-8 animate-in fade-in duration-500 overflow-y-auto h-full">

        <div className="mb-12 flex flex-col items-start w-full">
          <h1 className="text-6xl font-display font-black text-white mb-2 tracking-tighter flex items-center gap-3">
            {topic && <span className="text-gray-600 text-4xl">#</span>}
            {topic ? topic : "Feed"}
          </h1>
          <p className="text-gray-500 text-xl font-medium">
            {topic ? `Exploring transmissions about ${topic}.` : "Transmissions from the void."}
          </p>
        </div>

        {/* 3. POSTS CONTAINER */}
        <div className="w-full flex flex-col gap-4 pb-20">
          {(!posts || posts.length === 0) ? (
            <div className="p-10 border border-white/10 bg-[#121214] rounded-3xl text-left">
              <h2 className="text-xl font-display font-bold text-white mb-2">No signals yet.</h2>
              <p className="text-gray-500">Be the first to transmit.</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={handleLike}
                onUserClick={(user) => setSelectedUser(user)}
                onClick={() => router.push(`/post/${post.id}`)}
              />
            ))
          )}
        </div>

        {/* Modals */}
        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPost={handlePost}
        />

        <UserPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      </div>

      {/* Floating Action Button - Outside scrollable container */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="absolute bottom-8 right-8 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <Plus size={32} />
      </button>
    </>
  );
}
