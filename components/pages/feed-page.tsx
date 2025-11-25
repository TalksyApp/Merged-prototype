"use client"

import React, { useState, useEffect } from 'react';
import PostCard from '@/components/post-card';
import CreateModal from '@/components/create-modal';
import UserPopup from '@/components/user-popup';
import { storage, type User, type Post } from "@/lib/storage"
import { Plus, Zap } from 'lucide-react';

interface FeedPageProps {
  currentUser: User
}

export default function FeedPage({ currentUser }: FeedPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [topic, setTopic] = useState<string | null>(null) // Feed is general for now
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const allPosts = storage.getPosts()
    setPosts(allPosts.sort((a, b) => b.timestamp - a.timestamp))
  }, [])

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

  const handlePost = (text: string, tags: string[], options: { isBoosted: boolean }) => {
    const newPost: Post = {
      id: Date.now().toString(),
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
    };

    storage.addPost(newPost);
    setPosts([newPost, ...posts]);
  };

  return (
    // 1. Main Wrapper: Full Width + Padding Left (Keeps Headline near Sidebar)
    <div className="w-full pt-10 pb-32 px-8 animate-in fade-in duration-500 overflow-y-auto h-full relative">

      {/* 2. HEADER: Stays on the Left */}
      <div className="mb-12 flex flex-col items-start w-full">
        <h1 className="text-6xl font-display font-black text-white mb-2 tracking-tighter flex items-center gap-3">
          {topic && <span className="text-gray-600 text-4xl">#</span>}
          {topic ? topic : "Feed"}
        </h1>
        <p className="text-gray-500 text-xl font-medium">
          {topic ? `Exploring transmissions about ${topic}.` : "Transmissions from the void."}
        </p>
      </div>

      {/* 3. POSTS CONTAINER: Centered (mx-auto) & Restricted Width */}
      <div className="w-full flex flex-col gap-6 pb-20">
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
            />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <Plus size={32} />
      </button>

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
  );
}
