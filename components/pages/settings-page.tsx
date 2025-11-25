"use client"

import React, { useState } from 'react';
import {
    Bell, Moon, Lock, User as UserIcon, LogOut, ChevronRight,
    Shield, Eye, Volume2, Trash2, Palette
} from 'lucide-react';
import { storage, type User } from "@/lib/storage"

interface SettingsPageProps {
    currentUser: User
    onNavigate: (page: string) => void
    onLogout: () => void
}

export default function SettingsPage({ currentUser, onNavigate, onLogout }: SettingsPageProps) {
    const [isPureBlack, setIsPureBlack] = useState(false);
    const [settings, setSettings] = useState({
        notifications: true,
        sound: false,
        privateAccount: false,
        ghostMode: true
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleTheme = () => {
        setIsPureBlack(!isPureBlack);
        // In a real app, this would trigger a theme change in a context or body class
        document.body.setAttribute('data-theme', !isPureBlack ? 'pure' : 'nebula');
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to log out?")) {
            onLogout();
        }
    };

    return (
        <div className="w-full pt-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 overflow-y-auto h-full">

            <div className="mb-12">
                <h1 className="text-5xl font-display font-black text-white mb-2 tracking-tight">Settings</h1>
                <p className="text-gray-500 text-lg font-medium">Control your signal in the void.</p>
            </div>

            <div className="flex flex-col gap-8 pb-20">

                {/* --- 1. ACCOUNT SECTION --- */}
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Account</h3>
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">

                        {/* Click to go to Profile */}
                        <SettingRow
                            icon={UserIcon}
                            label="Edit Profile"
                            sublabel="Change name, bio, and avatar"
                            onClick={() => onNavigate('profile')}
                            isLink
                        />

                        <div className="h-px w-full bg-white/5"></div>

                        <SettingRow
                            icon={Lock}
                            label="Change Password"
                            onClick={() => alert("Password change feature coming soon!")}
                            isLink
                        />

                        <div className="h-px w-full bg-white/5"></div>

                        <SettingRow
                            icon={Shield}
                            label="Two-Factor Authentication"
                            value="Enabled"
                            onClick={() => alert("2FA Settings")}
                            isLink
                        />
                    </div>
                </section>

                {/* --- 2. APPEARANCE (Theme) --- */}
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Appearance</h3>
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">

                        {/* THEME TOGGLE */}
                        <ToggleRow
                            icon={Palette}
                            label="App Theme"
                            sublabel={isPureBlack ? "Active: Void Black (OLED)" : "Active: Deep Nebula"}
                            isOn={isPureBlack}
                            onClick={toggleTheme}
                        />

                        <div className="h-px w-full bg-white/5"></div>

                        <ToggleRow
                            icon={Volume2}
                            label="In-App Sounds"
                            isOn={settings.sound}
                            onClick={() => toggle('sound')}
                        />
                    </div>
                </section>

                {/* --- 3. EXPERIENCE --- */}
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Experience</h3>
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
                        <ToggleRow
                            icon={Bell}
                            label="Push Notifications"
                            isOn={settings.notifications}
                            onClick={() => toggle('notifications')}
                        />
                    </div>
                </section>

                {/* --- 4. PRIVACY --- */}
                <section>
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 px-2">Privacy & Void</h3>
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-indigo-500/20 rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[50px]"></div>
                        <ToggleRow icon={Eye} label="Ghost Mode" sublabel="Hide your online status" isOn={settings.ghostMode} onClick={() => toggle('ghostMode')} />
                        <div className="h-px w-full bg-white/5"></div>
                        <ToggleRow icon={Lock} label="Private Account" sublabel="Only approved users can see your feed" isOn={settings.privateAccount} onClick={() => toggle('privateAccount')} />
                    </div>
                </section>

                {/* --- 5. DANGER ZONE --- */}
                <section>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-3xl overflow-hidden mt-4">

                        <button
                            onClick={handleLogout}
                            className="w-full p-6 flex items-center justify-between group hover:bg-red-500/10 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <LogOut size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-red-400 text-lg">Log Out</div>
                                    <div className="text-sm text-red-400/60">End your session securely</div>
                                </div>
                            </div>
                        </button>

                        <div className="h-px w-full bg-red-500/10"></div>

                        <button
                            onClick={() => alert("Account deletion is permanent. Contact support.")}
                            className="w-full p-6 flex items-center justify-between group hover:bg-red-500/20 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Trash2 size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-red-500 text-lg">Delete Account</div>
                                    <div className="text-sm text-red-400/60">Permanently remove all data</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
}

// --- HELPER COMPONENTS ---

const SettingRow = ({ icon: Icon, label, sublabel, value, isLink, onClick }: any) => (
    <div
        onClick={onClick}
        className="p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors group"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                <Icon size={20} />
            </div>
            <div>
                <div className="font-bold text-white text-lg">{label}</div>
                {sublabel && <div className="text-sm text-gray-500">{sublabel}</div>}
            </div>
        </div>
        <div className="flex items-center gap-3">
            {value && <span className="text-sm font-medium text-gray-400">{value}</span>}
            {isLink && <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />}
        </div>
    </div>
);

const ToggleRow = ({ icon: Icon, label, sublabel, isOn, onClick, disabled }: any) => (
    <div className={`p-5 flex items-center justify-between transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}`} onClick={!disabled ? onClick : undefined}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isOn ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 'bg-white/5 text-gray-400 border-white/5'}`}>
                <Icon size={20} />
            </div>
            <div>
                <div className="font-bold text-white text-lg">{label}</div>
                {sublabel && <div className="text-sm text-gray-500">{sublabel}</div>}
            </div>
        </div>
        <div className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${isOn ? 'bg-indigo-600' : 'bg-white/10'}`}>
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
    </div>
);
