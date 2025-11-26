"use client"

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Hash, Bell, Users, Search, HelpCircle,
  PlusCircle, Gift, Sticker, Smile, Send
} from 'lucide-react';
import { type Topic, type User, type Post } from "@/lib/storage"
import PostCard from "@/components/post-card"

interface TopicDetailProps {
  topic: { name: string } | any; // Allow simplified topic or full Topic object
  onBack: () => void;
  currentUser: User;
}

export default function TopicDetail({ topic, currentUser, onBack }: TopicDetailProps) {
  const [inputValue, setInputValue] = useState("");
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchTopicPosts = async () => {
      try {
        const response = await fetch(`/api/posts?userId=${currentUser.id}`)
        if (response.ok) {
          const allPosts = await response.json()
          // Filter posts by tag matching topic name
          const topicPosts = allPosts.filter((post: any) => 
            post.tags && post.tags.includes(topic.name)
          )
          
          // Transform to Post interface
          const transformedPosts = topicPosts.map((post: any) => ({
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
        }
      } catch (error) {
        console.error('Error fetching topic posts:', error)
      }
    }
    fetchTopicPosts()
  }, [topic, currentUser.id])

  const handleSend = async () => {
    if (inputValue.trim()) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: inputValue.trim(),
            userId: currentUser.id,
            tags: [topic.name],
            isBoosted: false
          })
        })

        if (response.ok) {
          const { id } = await response.json()
          const newPost: Post = {
            id,
            userId: currentUser.id,
            content: inputValue.trim(),
            timestamp: Date.now(),
            likes: [],
            replies: [],
            // @ts-ignore
            author: currentUser.username,
            handle: `@${currentUser.username}`,
            avatar: currentUser.avatar_initials || currentUser.username[0],
            tags: [topic.name],
            isBoosted: false,
            isLikedByUser: false
          }

          setPosts([newPost, ...posts])
          setInputValue("")
        }
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }
  };

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

      if (!response.ok) {
        // Revert on error
        setPosts(posts)
      }
    } catch (error) {
      console.error('Error liking post:', error)
      // Revert on error
      setPosts(posts)
    }
  }

  // Default starter message if no posts exist
  const displayPosts = posts.length > 0 ? posts : [];

  return (
    // WIDTH FIXED: Full Screen
    <div className="flex flex-col h-full w-full bg-background animate-in fade-in duration-300 relative z-10">

      {/* --- 1. HEADER (Sticky) --- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/10 p-2 rounded-full text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <Hash size={24} className="text-gray-400" />
            <h1 className="text-xl font-bold text-white font-display tracking-tight">{topic.name}</h1>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <p className="text-sm text-gray-400 hidden md:block truncate max-w-xs cursor-default">
            {topic.description}
          </p>
        </div>

        <div className="flex items-center gap-5 text-gray-400">
          <Bell size={22} className="hover:text-white cursor-pointer transition-colors" />
          <Users size={22} className="hover:text-white cursor-pointer transition-colors hidden sm:block" />
          <div className="hidden lg:flex items-center bg-[#111] px-3 py-1.5 rounded border border-white/5">
            <input placeholder="Search" className="bg-transparent text-sm text-white outline-none w-24 placeholder-gray-600" />
            <Search size={14} />
          </div>
        </div>
      </div>

      {/* --- 2. CHAT STREAM (Scrollable) --- */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide pb-24">
        {/* Welcome Graphic */}
        <div className="mt-8 mb-12 px-4 border-b border-white/5 pb-8">
          <div className="w-16 h-16 bg-[#202225] rounded-full flex items-center justify-center mb-4">
            <Hash size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Welcome to #{topic.name}!</h2>
          <p className="text-gray-400">This is the start of the <span className="font-bold text-white">#{topic.name}</span> channel.</p>
        </div>

        {displayPosts.length === 0 && (
          <div className="px-4 py-2 text-gray-500">
            Welcome to the #{topic.name} channel. Be the first to transmit.
          </div>
        )}

        {displayPosts.map((post) => (
          <div key={post.id} className="hover:bg-[#2f3136]/30 px-2 py-2 rounded-lg transition-colors">
            <PostCard post={post} currentUser={currentUser} onLike={handleLike} />
          </div>
        ))}
      </div>

      {/* --- 3. INPUT AREA (Sticky Bottom) --- */}
      <div className="px-6 pb-6 pt-2 bg-gradient-to-t from-black via-black to-transparent z-30">
        <div className="bg-[#202225] rounded-2xl flex items-center px-4 py-3 border border-white/5 shadow-2xl">

          <button className="bg-gray-400 text-[#202225] rounded-full p-1 hover:text-white hover:bg-gray-500 transition-colors mr-4">
            <PlusCircle size={20} fill="currentColor" className="text-[#202225]" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message #${topic.name}`}
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none text-base font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <div className="flex items-center gap-4 text-gray-400 mx-2">
            <Gift size={24} className="hover:text-yellow-400 cursor-pointer transition-colors hidden sm:block" />
            <Sticker size={24} className="hover:text-blue-400 cursor-pointer transition-colors" />
            <Smile size={24} className="hover:text-yellow-400 cursor-pointer transition-colors" />
          </div>

          {inputValue.trim() && (
            <button onClick={handleSend} className="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors">
              <Send size={24} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
