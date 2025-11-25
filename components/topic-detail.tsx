"use client"

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Hash, Bell, Users, Search, HelpCircle,
  PlusCircle, Gift, Sticker, Smile, Send
} from 'lucide-react';
import { storage, type Topic, type User, type Post } from "@/lib/storage"
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
    // Fetch posts for this topic
    const allPosts = storage.getPosts()

    let topicPosts: Post[] = []

    if (topic.posts) {
      topicPosts = allPosts.filter((p) => topic.posts.includes(p.id))
    } else if (topic.name) {
      // Fallback: Filter by tag matching topic name
      // @ts-ignore
      topicPosts = allPosts.filter((p) => p.tags && p.tags.includes(topic.name))
    }

    setPosts(topicPosts.sort((a, b) => b.timestamp - a.timestamp))
  }, [topic])

  const handleSend = () => {
    if (inputValue.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        userId: currentUser.id,
        content: inputValue.trim(),
        timestamp: Date.now(),
        likes: [],
        replies: [],
        // Add tags if Post type supports it, otherwise just content
      }

      storage.addPost(newPost)

      // Update topic with new post ID if it's a full topic object
      if (topic.posts) {
        const updatedTopic = { ...topic, posts: [...topic.posts, newPost.id] }
        // Update topic in storage (simplified)
        const topics = storage.getTopics()
        const index = topics.findIndex(t => t.id === topic.id)
        if (index !== -1) {
          topics[index] = updatedTopic
          localStorage.setItem("talksy_topics", JSON.stringify(topics))
        }
      }

      setPosts([newPost, ...posts])
      setInputValue("");
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(currentUser.id)
        return {
          ...post,
          likes: isLiked ? post.likes.filter(id => id !== currentUser.id) : [...post.likes, currentUser.id]
        }
      }
      return post
    }))
  }

  // Default starter message if no posts exist
  const displayPosts = posts.length > 0 ? posts : [];

  return (
    // WIDTH FIXED: Full Screen
    <div className="flex flex-col h-[calc(100vh-20px)] w-full animate-in fade-in duration-300">

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

        {displayPosts.map((post, index) => (
          <div key={post.id} className="hover:bg-[#2f3136]/30 px-2 py-2 rounded-lg transition-colors">
            <PostCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} />
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
