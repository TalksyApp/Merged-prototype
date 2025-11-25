"use client"

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, Zap } from 'lucide-react';

interface PostCardProps {
  post: any; // Using any for now to facilitate integration
  onUserClick?: (post: any) => void;
  currentUser?: any;
  onLike?: (id: string) => void;
}

const Avatar = ({ char, isBoosted }: { char: string, isBoosted: boolean }) => (
  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-white font-bold shadow-lg shrink-0 transition-all duration-300
    ${isBoosted
      ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
      : 'bg-gradient-to-br from-[#222] to-[#111] border-white/10'}`
  }>
    {char}
  </div>
);

export default function PostCard({ post, onUserClick, currentUser, onLike }: PostCardProps) {
  // Dynamic Styles based on "Boost"
  const isBoosted = post.isPromoted || post.isBoosted; // Handle both naming conventions

  // Adapt post data if it comes from storage (different field names)
  const authorName = post.author || "User";
  const handle = post.handle || `@${authorName.toLowerCase()}`;
  const avatarChar = post.avatar || authorName[0] || "?";
  const time = post.time || (post.timestamp ? new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now");
  const likesCount = post.likes ? (Array.isArray(post.likes) ? post.likes.length : post.likes) : 0;
  const commentsCount = post.comments || (post.replies ? post.replies.length : 0);

  return (
    <div className={`bg-[#0a0a0a]/80 backdrop-blur-sm border rounded-[32px] p-8 relative overflow-hidden transition-all duration-300 group
      ${isBoosted
        ? 'border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.05)] hover:border-yellow-500/60'
        : 'border-white/10 hover:border-white/20 hover:bg-[#111]'}`
    }>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div
          className="flex gap-4 items-center cursor-pointer"
          onClick={(e) => { e.stopPropagation(); if (onUserClick) onUserClick({ ...post, author: authorName, handle, avatar: avatarChar }); }}
        >
          <Avatar char={avatarChar} isBoosted={isBoosted} />
          <div>
            <div className="flex items-center gap-2">
              <div className={`font-bold text-xl transition-colors ${isBoosted ? 'text-yellow-100' : 'text-white group-hover:text-indigo-400'}`}>{authorName}</div>
              {/* Verified Badge */}
              <CheckCircle2 size={14} className="text-blue-500" fill="black" />
            </div>
            <div className="text-sm text-gray-500">{handle} • {time}</div>
          </div>
        </div>

        {/* Top Right Icon (Menu or Boost Badge) */}
        {isBoosted ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1">
            <Zap size={12} fill="currentColor" /> PROMOTED
          </div>
        ) : (
          <button className="text-gray-600 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
        )}
      </div>

      {/* Content */}
      <p className="text-xl text-gray-100 font-light leading-relaxed mb-6 pl-[64px]">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pl-[64px] mb-6 flex gap-2 flex-wrap">
          {post.tags.map((tag: string, i: number) => (
            <span key={i} className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between pl-[64px] pt-6 border-t border-white/5">
        <div className="flex gap-6">
          <Btn icon={Heart} count={likesCount} color="hover:text-pink-500" onClick={() => onLike && onLike(post.id)} />
          <Btn icon={MessageCircle} count={commentsCount} color="hover:text-blue-400" />
          <Btn icon={Share2} color="hover:text-green-400" />
        </div>
      </div>
    </div>
  );
}

const Btn = ({ icon: Icon, count, color, onClick }: { icon: any, count?: number, color: string, onClick?: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-2 text-gray-500 ${color} transition-all`}>
    <Icon size={20} /> {count !== undefined && <span className="text-sm font-medium">{count}</span>}
  </button>
);
