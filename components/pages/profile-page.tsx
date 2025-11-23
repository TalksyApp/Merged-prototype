"use client"

import type React from "react"

import { useState } from "react"
import { storage, type User } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Cake, Sparkles, Bone as Tongue, Users, Home, Edit2 } from 'lucide-react'

interface ProfilePageProps {
  currentUser: User
  onUserUpdate: (user: User) => void
}

export default function ProfilePage({ currentUser, onUserUpdate }: ProfilePageProps) {
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
    <div className="h-full overflow-y-auto w-full">
      <div className="w-full p-4">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-32 rounded-t-xl mb-0" />

        <div className="bg-card border border-border rounded-b-xl p-6 border-t-0">
          <div className="flex items-start justify-between mb-6 -mt-16 relative z-10">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-2xl text-card border-4 border-card shadow-lg shadow-primary/30">
                {currentUser.avatar}
              </div>
              <div className="pb-2">
                <h1 className="text-2xl font-bold text-foreground">@{currentUser.username}</h1>
                <p className="text-muted-foreground text-sm">{currentUser.email}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`transition-all ${
                isEditing
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              } font-semibold flex items-center gap-2`}
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {!isEditing && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Topics</p>
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground p-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City of Birth</label>
                  <Input
                    type="text"
                    name="cityOfBirth"
                    value={formData.cityOfBirth}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Birthday</label>
                  <Input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Zodiac</label>
                  <Input
                    type="text"
                    name="zodiac"
                    value={formData.zodiac}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mother Tongue</label>
                  <Input
                    type="text"
                    name="motherTongue"
                    value={formData.motherTongue}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-lg text-foreground p-2"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current City</label>
                  <Input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">School/College</label>
                  <Input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-pulse"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentUser.bio && (
                <div className="bg-input rounded-lg p-3 border border-border">
                  <p className="text-foreground leading-relaxed">{currentUser.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.cityOfBirth && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Born in {currentUser.cityOfBirth}</span>
                  </div>
                )}

                {currentUser.birthday && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cake className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{currentUser.birthday}</span>
                  </div>
                )}

                {currentUser.zodiac && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{currentUser.zodiac}</span>
                  </div>
                )}

                {currentUser.motherTongue && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tongue className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{currentUser.motherTongue}</span>
                  </div>
                )}

                {currentUser.gender && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{currentUser.gender}</span>
                  </div>
                )}

                {currentUser.currentCity && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Home className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Lives in {currentUser.currentCity}</span>
                  </div>
                )}

                {currentUser.school && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">School: {currentUser.school}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
