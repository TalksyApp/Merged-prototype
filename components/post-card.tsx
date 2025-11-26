"use client"

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, Zap } from 'lucide-react';

interface PostCardProps {
  post: any; // Using any for now to facilitate integration
  onUserClick?: (post: any) => void;
  currentUser?: any;
  onLike?: (id: string) => void;
  onClick?: () => void;
}

const Avatar = ({ char, isBoosted }: { char: string, isBoosted: boolean }) => (
  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0 transition-all duration-300
    ${isBoosted
      ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
      : 'bg-gradient-to-br from-[#222] to-[#111] border-white/10'}`
  }>
    {char}
  </div>
);

export default function PostCard({ post, onUserClick, currentUser, onLike, onClick }: PostCardProps) {
  // Dynamic Styles based on "Boost"
  const isBoosted = post.isPromoted || post.isBoosted; // Handle both naming conventions

  // Adapt post data if it comes from storage (different field names)
  const authorName = post.author || "User";
  const handle = post.handle || `@${authorName.toLowerCase()}`;
  const avatarChar = post.avatar || authorName[0] || "?";
  const time = post.time || (post.timestamp ? new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now");
  const likesCount = post.likes ? (Array.isArray(post.likes) ? post.likes.length : post.likes) : 0;
  const commentsCount = post.comments || (post.replies ? post.replies.length : 0);
  const isLiked = post.isLikedByUser || false;

  return (
    <div 
      onClick={onClick}
      className={`bg-[#0a0a0a]/80 backdrop-blur-sm border rounded-[24px] p-5 relative overflow-hidden transition-all duration-300 group cursor-pointer
      ${isBoosted
        ? 'border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.05)] hover:border-yellow-500/60'
        : 'border-white/10 hover:border-white/20 hover:bg-[#111]'}`
    }>

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={(e) => { e.stopPropagation(); if (onUserClick) onUserClick({ ...post, author: authorName, handle, avatar: avatarChar }); }}
        >
          <Avatar char={avatarChar} isBoosted={isBoosted} />
          <div>
            <div className="flex items-center gap-2">
              <div className={`font-bold text-base transition-colors ${isBoosted ? 'text-yellow-100' : 'text-white group-hover:text-indigo-400'}`}>{authorName}</div>
              {/* Verified Badge */}
              <CheckCircle2 size={12} className="text-blue-500" fill="black" />
            </div>
            <div className="text-xs text-gray-500">{handle} • {time}</div>
          </div>
        </div>

        {/* Top Right Icon (Menu or Boost Badge) */}
        {isBoosted ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-yellow-400 flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> PROMOTED
          </div>
        ) : (
          <button className="text-gray-600 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
        )}
      </div>

      {/* Content */}
      <p className="text-base text-gray-100 font-light leading-relaxed mb-3 pl-[52px]">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pl-[52px] mb-3 flex gap-2 flex-wrap">
          {post.tags.map((tag: string, i: number) => (
            <span key={i} className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between pl-[52px] pt-3 border-t border-white/5">
        <div className="flex gap-5">
          <Btn icon={Heart} count={likesCount} color="hover:text-pink-500" isActive={isLiked} onClick={() => onLike && onLike(post.id)} />
          <Btn icon={MessageCircle} count={commentsCount} color="hover:text-blue-400" />
          <Btn icon={Share2} color="hover:text-green-400" />
        </div>
      </div>
    </div>
  );
}

const Btn = ({ icon: Icon, count, color, onClick, isActive }: { icon: any, count?: number, color: string, onClick?: () => void, isActive?: boolean }) => (
  <button onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} className={`flex items-center gap-1.5 transition-all ${isActive ? 'text-pink-500' : `text-gray-500 ${color}`}`}>
    <Icon size={18} fill={isActive ? 'currentColor' : 'none'} /> {count !== undefined && <span className="text-xs font-medium">{count}</span>}
  </button>
);
