"use client"

import React from 'react';
import { X, MapPin, User, Languages, MessageCircle, UserPlus, CheckCircle } from 'lucide-react';

interface UserPopupProps {
    user: any; // Using any for now to match provided usage, can be refined later
    onClose: () => void;
    onNavigateToMessages?: () => void;
}

const USER_DETAILS: Record<string, { bio: string; city: string; gender: string; lang: string }> = {
    "Design_God": { bio: "Obsessed with pixels and dark mode.", city: "Berlin, DE", gender: "Male", lang: "German" },
    "CodeNinja": { bio: "I dream in JavaScript.", city: "SF, USA", gender: "Female", lang: "English" },
    "Minimalist": { bio: "Less is more.", city: "Tokyo, JP", gender: "NB", lang: "Japanese" },
    "Neon_Rider": { bio: "Chasing the synthwave sunset.", city: "Miami, USA", gender: "Male", lang: "Spanish" },
    "You": { bio: "Developer. Dreamer.", city: "Patna, IN", gender: "Male", lang: "Hindi" }
};

export default function UserPopup({ user, onClose, onNavigateToMessages }: UserPopupProps) {
    if (!user) return null;

    const details = USER_DETAILS[user.author] || { bio: "Traveler of the void.", city: "Unknown", gender: "Unknown", lang: "Universal" };

    return (
        // FIX 1: Lighter backdrop (bg-black/40 instead of /80) so you see the feed behind it
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>

            {/* FIX 2: Lighter Card Background (bg-[#121212]) and stronger Border */}
            <div
                className="bg-[#121212] w-full max-w-sm rounded-[36px] border border-white/20 p-1 relative shadow-2xl transform transition-all scale-100 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >

                {/* Inner Content */}
                <div className="bg-[#18181b] rounded-[32px] p-6 relative overflow-hidden h-full">

                    {/* FIX 3: Vibrant Gradient (Removed dark overlay) */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-100"></div>

                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all z-20 text-white border border-white/20">
                        <X size={16} />
                    </button>

                    {/* Avatar & Header */}
                    <div className="flex flex-col items-center text-center mt-12 relative z-10">
                        <div className="w-24 h-24 rounded-full bg-[#111] border-[4px] border-[#18181b] flex items-center justify-center text-white font-bold text-4xl shadow-xl">
                            {user.avatar}
                        </div>
                        <div className="mt-3">
                            <h2 className="text-2xl font-black text-white flex items-center gap-2 justify-center">
                                {user.author}
                                <CheckCircle size={16} className="text-blue-400" fill="currentColor" color="black" />
                            </h2>
                            <p className="text-gray-400 text-sm font-medium">{user.handle}</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-5 text-center px-2">
                        <p className="text-white text-base font-medium">"{details.bio}"</p>
                    </div>

                    {/* Info Pills (High Contrast) */}
                    <div className="flex justify-center gap-2 mt-6 flex-wrap">
                        <div className="bg-[#222] px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-bold text-gray-300">
                            <MapPin size={12} className="text-indigo-400" /> {details.city}
                        </div>
                        <div className="bg-[#222] px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-bold text-gray-300">
                            <User size={12} className="text-pink-400" /> {details.gender}
                        </div>
                        <div className="bg-[#222] px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-bold text-gray-300">
                            <Languages size={12} className="text-green-400" /> {details.lang}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-8">
                        <button className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg">
                            <UserPlus size={18} /> Connect
                        </button>
                        <button
                            onClick={onNavigateToMessages}
                            className="flex-1 bg-[#2a2a2d] text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 border border-white/10"
                        >
                            <MessageCircle size={18} /> Message
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
