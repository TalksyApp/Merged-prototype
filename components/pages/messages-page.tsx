"use client"

import React, { useState } from 'react';
import { Search, Send, MoreVertical, ArrowLeft, Image as ImageIcon, Smile, Camera } from 'lucide-react';

// --- MOCK CONTACTS ---
const CONTACTS = [
    { id: 1, name: "Design_God", handle: "@visuals", avatar: "D", status: "online", lastMsg: "Did you see the new layout?", time: "2m" },
    { id: 2, name: "Neon_Rider", handle: "@city", avatar: "N", status: "offline", lastMsg: "The grid is quiet tonight.", time: "1h" },
    { id: 3, name: "System_Bot", handle: "@void", avatar: "S", status: "online", lastMsg: "Welcome to Talksy Void.", time: "1d" },
];

// --- MOCK CHAT HISTORY ---
const INITIAL_CHATS: Record<number, { id: number; sender: string; text: string; time: string }[]> = {
    1: [
        { id: 1, sender: "them", text: "Yo! The new profile update looks sick.", time: "10:00 AM" },
        { id: 2, sender: "me", text: "Thanks! I removed the follower counts.", time: "10:05 AM" },
        { id: 3, sender: "them", text: "Smart move. Pure vibes only.", time: "10:06 AM" },
    ],
    2: [
        { id: 1, sender: "them", text: "Raining again...", time: "8:00 PM" },
    ]
};

export default function MessagesPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [chats, setChats] = useState(INITIAL_CHATS);

    const activeContact = CONTACTS.find(c => c.id === selectedId);
    const activeMessages = selectedId ? (chats[selectedId] || []) : [];

    const handleSend = () => {
        if (!input.trim() || !selectedId) return;

        const newMsg = { id: Date.now(), sender: "me", text: input, time: "Just now" };

        setChats(prev => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), newMsg]
        }));
        setInput("");
    };

    return (
        <div className="w-full h-[calc(100vh-40px)] pt-8 pb-8 flex gap-6 animate-in fade-in duration-500 px-6">

            {/* --- LEFT: CONTACT LIST --- */}
            <div className={`w-full md:w-[380px] flex-shrink-0 flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden ${selectedId ? 'hidden md:flex' : 'flex'}`}>

                <div className="p-6 pb-4">
                    <h1 className="text-3xl font-black text-white mb-6">Messages</h1>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                        <input className="w-full bg-[#121214] text-white pl-12 pr-4 py-4 rounded-2xl outline-none border border-white/5 focus:border-white/20 transition-all placeholder-gray-600 text-lg" placeholder="Search..." />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-1">
                    {CONTACTS.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedId(contact.id)}
                            className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center gap-4 ${selectedId === contact.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full bg-[#18181b] border border-white/10 flex items-center justify-center font-bold text-xl text-white">
                                    {contact.avatar}
                                </div>
                                {contact.status === 'online' && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-bold text-lg ${selectedId === contact.id ? 'text-white' : 'text-gray-200'}`}>{contact.name}</span>
                                    <span className="text-xs text-gray-600">{contact.time}</span>
                                </div>
                                <p className={`text-sm truncate ${selectedId === contact.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {contact.lastMsg}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT: CHAT WINDOW --- */}
            <div className={`flex-1 bg-[#0a0a0a] border border-white/10 rounded-[32px] flex flex-col overflow-hidden relative ${!selectedId ? 'hidden md:flex' : 'flex'}`}>

                {selectedId && activeContact ? (
                    <>
                        {/* Chat Header (Cleaned up - No Calls) */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedId(null)} className="md:hidden w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                                    {activeContact.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-xl text-white">{activeContact.name}</div>
                                    <div className="text-xs text-gray-400">{activeContact.handle} • {activeContact.status}</div>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages Area (Insta Style Bubbles) */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
                            {activeMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-5 py-3.5 rounded-[22px] text-[1.05rem] leading-relaxed ${msg.sender === 'me'
                                        ? 'bg-indigo-600 text-white rounded-br-md shadow-lg'
                                        : 'bg-[#1f1f22] text-white rounded-bl-md'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area (Insta Style Pill) */}
                        <div className="p-5">
                            <div className="p-2 pl-4 bg-[#121214] border border-white/10 rounded-full flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 cursor-pointer hover:bg-indigo-500 hover:text-white transition-all">
                                    <Camera size={20} /> {/* Replaced Image with Camera for aesthetics if needed, or use ImageIcon */}
                                </div>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message..."
                                    className="flex-1 bg-transparent text-lg text-white outline-none px-2 placeholder-gray-500"
                                />
                                {input.trim() ? (
                                    <button onClick={handleSend} className="px-5 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-sm">
                                        Send
                                    </button>
                                ) : (
                                    <div className="flex gap-2 pr-2 text-gray-500">
                                        <Smile size={24} className="hover:text-white cursor-pointer transition-colors" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Send size={40} className="text-white/20" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your Messages</h2>
                        <p className="text-gray-500">Send private photos and messages to a friend.</p>
                        <button className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                            Send Message
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
