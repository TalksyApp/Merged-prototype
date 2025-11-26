"use client"

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ArrowLeft, Send, CheckCircle2, Zap } from 'lucide-react';
import type { User } from "@/lib/storage"

interface Comment {
  id: string;
  userId: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: number;
  likes: string[];
}

interface PostDetailProps {
  post: any;
  currentUser: User;
  onBack: () => void;
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

export default function PostDetail({ post, currentUser, onBack, onLike }: PostDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBoosted = post.isPromoted || post.isBoosted;
  const authorName = post.author || "User";
  const handle = post.handle || `@${authorName.toLowerCase()}`;
  const avatarChar = post.avatar || authorName[0] || "?";
  const time = post.time || (post.timestamp ? new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now");
  const likesCount = post.likes ? (Array.isArray(post.likes) ? post.likes.length : post.likes) : 0;
  const isLiked = post.isLikedByUser || false;

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched comments:', data);
        setComments(data);
      } else {
        console.error('Failed to fetch comments:', response.status);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    console.log('Submitting comment with userId:', currentUser.id);
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          userId: currentUser.id
        })
      });

      console.log('Comment POST response:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Comment created:', result);
        setCommentText('');
        // Refetch comments to get the saved comment from the database
        await fetchComments();
      } else {
        console.error('Failed to create comment:', await response.text());
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const isLiked = comment.likes.includes(currentUser.id);
        return {
          ...comment,
          likes: isLiked ? comment.likes.filter(id => id !== currentUser.id) : [...comment.likes, currentUser.id]
        };
      }
      return comment;
    }));
  };

  return (
    <div className="w-full h-full overflow-y-auto pt-10 pb-32 px-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Feed</span>
      </button>

      {/* Post Content */}
      <div className={`bg-[#0a0a0a]/80 backdrop-blur-sm border rounded-[32px] p-8 mb-6 transition-all duration-300
        ${isBoosted
          ? 'border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.05)]'
          : 'border-white/10'}`
      }>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4 items-center">
            <Avatar char={avatarChar} isBoosted={isBoosted} />
            <div>
              <div className="flex items-center gap-2">
                <div className={`font-bold text-xl transition-colors ${isBoosted ? 'text-yellow-100' : 'text-white'}`}>{authorName}</div>
                <CheckCircle2 size={14} className="text-blue-500" fill="black" />
              </div>
              <div className="text-sm text-gray-500">{handle} • {time}</div>
            </div>
          </div>

          {isBoosted && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1">
              <Zap size={12} fill="currentColor" /> PROMOTED
            </div>
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
        <div className="flex items-center gap-6 pl-[64px] pt-6 border-t border-white/5">
          <button
            onClick={() => onLike && onLike(post.id)}
            className={`flex items-center gap-2 transition-all ${isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-500">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{comments.length}</span>
          </div>
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Comment Input */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-[32px] p-6 mb-6">
        <div className="flex gap-4">
          <Avatar char={currentUser.avatar_initials || currentUser.username[0]} isBoosted={false} />
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent text-white placeholder-gray-600 outline-none resize-none text-lg"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmitComment();
                }
              }}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isSubmitting}
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        {comments.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
          <div key={`${comment.id}-${index}`} className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-[24px] p-6">
            <div className="flex gap-4">
              <Avatar char={comment.avatar} isBoosted={false} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-white">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.handle}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-100 mb-3">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleCommentLike(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-all text-sm"
                  >
                    <Heart size={16} />
                    <span>{comment.likes.length}</span>
                  </button>
                  <button className="text-gray-500 hover:text-blue-400 transition-all text-sm">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
