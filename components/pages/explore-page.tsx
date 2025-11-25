"use client"

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Zap } from 'lucide-react';
import type { User, Topic } from "@/lib/storage"
import TopicDetail from "@/components/topic-detail"

interface ExplorePageProps {
  currentUser: User
  selectedTopic: string | null
  onTopicSelect: (topicId: string | null) => void
  onNavigateToGroups: () => void
}

const TRENDING_TOPICS = ["Cyberpunk", "Void", "Design", "React", "Space", "Minimalism", "AI", "Music", "NightLife", "Coding"];

const FEATURED_CARDS = [
  { title: "The Digital Void", subtitle: "Philosophy", color: "from-indigo-500 to-purple-500", tag: "Void" },
  { title: "Neon Nights", subtitle: "Photography", color: "from-[#f91880] to-orange-500", tag: "NightLife" },
  { title: "Code Art", subtitle: "Development", color: "from-emerald-500 to-cyan-500", tag: "Coding" },
];

export default function ExplorePage({ currentUser, selectedTopic, onTopicSelect, onNavigateToGroups }: ExplorePageProps) {

  if (selectedTopic) {
    // Mock a topic object for the detail view since we just have the ID/Name
    const topic = { name: selectedTopic };
    return (
      <TopicDetail
        topic={topic}
        onBack={() => onTopicSelect(null)}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="w-full pt-10 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 px-6 overflow-y-auto h-full">

      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-display font-black text-white mb-2 tracking-tight">Explore</h1>
          <p className="text-gray-500 text-lg font-medium">Find your frequency in the noise.</p>
        </div>
        <button
          onClick={onNavigateToGroups}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          Group Chats
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-16 group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center px-6 py-5 transition-all group-focus-within:border-white/30">
          <Search className="text-gray-500 group-focus-within:text-white transition-colors mr-4" size={24} />
          <input type="text" placeholder="Search users, topics, or keywords..." className="w-full bg-transparent text-xl text-white placeholder-gray-600 outline-none border-none font-medium" />
        </div>
      </div>

      {/* Featured Cards */}
      <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3"><Zap className="text-yellow-400" fill="currentColor" /> Featured</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {FEATURED_CARDS.map((card, i) => (
          <div key={i} onClick={() => onTopicSelect(card.tag)} className="h-40 rounded-3xl relative overflow-hidden group cursor-pointer border border-white/5 hover:border-white/20 transition-all active:scale-95 z-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="absolute bottom-6 left-6">
              <div className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">{card.subtitle}</div>
              <div className="text-2xl font-display font-black text-white group-hover:translate-x-2 transition-transform">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Tags */}
      <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3"><TrendingUp className="text-[#f91880]" /> Trending Now</h3>
      <div className="flex flex-wrap gap-3">
        {TRENDING_TOPICS.map((topic, i) => (
          <div key={i} onClick={() => onTopicSelect(topic)} className="px-6 py-3 rounded-full border border-white/10 bg-[#121214] text-gray-400 cursor-pointer hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all duration-300 text-lg font-medium active:scale-95">
            #{topic}
          </div>
        ))}
      </div>
    </div>
  );
}
