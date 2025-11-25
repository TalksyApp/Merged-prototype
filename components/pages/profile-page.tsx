"use client"

import type React from "react"
import { useState } from "react"
import { storage, type User } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { MapPin, BookOpen, Edit2 } from "lucide-react"

interface ProfilePageProps {
  currentUser: User
  onUserUpdate: (user: User) => void
}

export default function ProfilePage({ currentUser, onUserUpdate }: ProfilePageProps) {
  // ... existing state and handlers ...
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(currentUser)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    storage.setCurrentUser(formData)
    onUserUpdate(formData)
    setIsEditing(false)
  }

  return (
    <div className="w-full pt-10 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 px-6">
      {/* Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-black relative">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="w-full px-6 pb-20 relative">
        {/* Profile Header */}
        <div className="flex items-end justify-between -mt-16 mb-12">
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 rounded-[24px] bg-[#050505] p-2">
              <div className="w-full h-full bg-[#1a1a1a] rounded-[20px] flex items-center justify-center text-4xl font-bold text-white border border-[#333]">
                {currentUser.avatar_initials || "X"}
              </div>
            </div>

            <div className="pb-4">
              <h1 className="text-4xl font-black text-white mb-1">{currentUser.username || "User"}</h1>
              <p className="text-gray-500 font-medium">@{currentUser.username?.toLowerCase() || "user"}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 mb-4"
          >
            <Edit2 className="w-4 h-4" />
            Edit Identity
          </button>
        </div>

        {/* Identity Matrix */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-white">Identity Matrix</h2>
            <span className="bg-[#1f1f1f] text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded">Public</span>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
                <label className="block text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-2">BIO</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#333] text-white focus:outline-none focus:border-[#FFD700] py-2"
                  rows={3}
                />
              </div>
              {/* Additional edit fields can go here similar to read-only view */}
              <div className="col-span-full">
                <Button onClick={handleSave} className="w-full bg-[#FFD700] text-black hover:bg-[#ffe033]">
                  Save Matrix
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 min-h-[120px] flex flex-col justify-center hover:border-[#333] transition-colors">
                <div className="flex items-center gap-3 text-[#585858] mb-2 uppercase text-xs font-bold tracking-wider">
                  <BookOpen className="w-4 h-4" /> BIO
                </div>
                <p className="text-gray-300 font-medium">{currentUser.bio || "No bio signal detected."}</p>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 min-h-[120px] flex flex-col justify-center hover:border-[#333] transition-colors">
                <div className="flex items-center gap-3 text-[#585858] mb-2 uppercase text-xs font-bold tracking-wider">
                  <MapPin className="w-4 h-4" /> Current City
                </div>
                <p className="text-gray-300 font-medium">{currentUser.currentCity || "Unknown coordinates"}</p>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 min-h-[120px] flex flex-col justify-center hover:border-[#333] transition-colors">
                <div className="flex items-center gap-3 text-[#585858] mb-2 uppercase text-xs font-bold tracking-wider">
                  <MapPin className="w-4 h-4" /> City of Birth
                </div>
                <p className="text-gray-300 font-medium">{currentUser.cityOfBirth || "Origin unknown"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
