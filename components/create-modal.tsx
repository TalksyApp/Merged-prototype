"use client"

import React, { useState } from 'react';
import { X, Zap, Hash } from 'lucide-react';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPost: (text: string, tags: string[], options: { isBoosted: boolean }) => void;
}

export default function CreateModal({ isOpen, onClose, onPost }: CreateModalProps) {
    const [text, setText] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [showTagInput, setShowTagInput] = useState(false);
    const [tagInput, setTagInput] = useState("");

    // --- THE VOLTAGE STATE ---
    const [isBoosted, setIsBoosted] = useState(false);

    if (!isOpen) return null;

    const handleAddTag = () => {
        if (tagInput.trim() && tags.length < 3) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
            if (tags.length === 2) setShowTagInput(false);
        }
    };

    const handleSubmit = () => {
        if (text.trim()) {
            // Send text, tags, and the boost status
            onPost(text, tags, { isBoosted });

            // Reset
            setText("");
            setTags([]);
            setIsBoosted(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            {/* The Modal Card - Glows Gold if Boosted */}
            <div className={`bg-[#0a0a0a] w-full max-w-xl rounded-[32px] border transition-all duration-500 p-6 relative shadow-2xl 
        ${isBoosted
                    ? 'border-yellow-500/50 shadow-[0_0_60px_rgba(234,179,8,0.2)]'
                    : 'border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'
                }`}
            >

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 transition-colors ${isBoosted ? 'text-yellow-400' : 'text-white'}`}>
                            {isBoosted ? '⚡ HIGH VOLTAGE' : 'TRANSMIT SIGNAL'}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                            {isBoosted ? 'Priority Broadcast' : 'Standard Frequency'}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"><X size={18} /></button>
                </div>

                {/* Main Input */}
                <div className="flex gap-4 mb-2">
                    {/* Avatar Pulse Effect if Boosted */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 transition-all duration-500 border ${isBoosted ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-[#18181b] border-white/10'}`}>
                        Y
                    </div>

                    <div className="flex-1">
                        <textarea
                            autoFocus
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What is happening in the void?"
                            className="w-full h-28 bg-transparent text-xl text-white placeholder-gray-600 outline-none resize-none border-none p-0 leading-relaxed font-medium"
                        />

                        {/* Tags Display */}
                        {tags.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {tags.map((tag, index) => (
                                    <span key={index} className="bg-[#1a1a1a] text-gray-300 border border-white/10 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 group">
                                        #{tag}
                                        <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400 transition-colors"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tag Input Area (Slide Down) */}
                {showTagInput && (
                    <div className="mb-4 ml-16 flex gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex-1 bg-[#111] border border-white/10 rounded-xl flex items-center px-3 focus-within:border-indigo-500 transition-colors">
                            <span className="text-gray-500 mr-1">#</span>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Tag (e.g. Design)"
                                className="bg-transparent text-white text-sm py-2.5 outline-none w-full font-medium"
                                autoFocus
                            />
                        </div>
                        <button onClick={handleAddTag} className="bg-white text-black px-4 rounded-xl font-bold text-xs hover:bg-gray-200">Add</button>
                    </div>
                )}

                {/* Footer Toolbar */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2 text-gray-500">

                        {/* 1. THUNDER (BOOST) - Now the star of the show */}
                        <button
                            onClick={() => setIsBoosted(!isBoosted)}
                            className={`h-10 px-4 rounded-full flex items-center gap-2 transition-all font-bold text-xs tracking-wide ${isBoosted ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                            title="Boost Visibility"
                        >
                            <Zap size={16} fill={isBoosted ? "currentColor" : "none"} />
                            {isBoosted ? 'BOOST ACTIVE' : 'Boost'}
                        </button>

                        {/* 2. HASH (TAGS) */}
                        <button
                            onClick={() => setShowTagInput(!showTagInput)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showTagInput || tags.length > 0 ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-white/5 hover:text-white'}`}
                            title="Add Tags"
                        >
                            <Hash size={18} />
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim()}
                        className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all ${text.trim() ? 'bg-white text-black hover:scale-105 shadow-lg' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                    >
                        Post
                    </button>
                </div>

            </div>
        </div>
    );
}
