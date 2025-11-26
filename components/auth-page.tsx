"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import type { User } from "@/lib/storage"

interface AuthPageProps {
  onUserCreated: (user: User) => void
}

export default function AuthPage({ onUserCreated }: AuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [step, setStep] = useState<"basic" | "profile">("basic")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  })

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    cityOfBirth: "",
    birthday: "",
    zodiac: "",
    motherTongue: "",
    gender: "",
    currentCity: "",
    school: "",
  })

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signinData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to sign in")
        setLoading(false)
        return
      }

      const user: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        bio: data.user.bio,
        cityOfBirth: data.user.cityOfBirth,
        birthday: data.user.birthday,
        zodiac: data.user.zodiac,
        motherTongue: data.user.motherTongue,
        gender: data.user.gender,
        currentCity: data.user.currentCity,
        school: data.user.school,
        avatar: data.user.avatar,
      }

      onUserCreated(user)
    } catch (err) {
      console.error("Sign in error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.username && formData.email && formData.password) {
      setError("")
      setStep("profile")
    } else {
      setError("Please fill in all required fields")
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create account")
        setLoading(false)
        return
      }

      const newUser: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        bio: data.user.bio,
        cityOfBirth: data.user.cityOfBirth,
        birthday: data.user.birthday,
        zodiac: data.user.zodiac,
        motherTongue: data.user.motherTongue,
        gender: data.user.gender,
        currentCity: data.user.currentCity,
        school: data.user.school,
        avatar: data.user.avatar,
      }

      onUserCreated(newUser)
    } catch (err) {
      console.error("Signup error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm("This will delete all users and data. Are you sure?")) return
    setResetLoading(true)
    try {
      const res = await fetch("/api/debug/reset", { method: "POST" })
      if (!res.ok) throw new Error("Reset failed")
      alert("Database reset. You can now sign up with a new account.")
      setError("")
      setMode("signup")
      setStep("basic")
    } catch (err) {
      alert("Failed to reset database")
    } finally {
      setResetLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (mode === "signin") {
      setSigninData((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-400 mb-2">TALKSY</h1>
          <p className="text-slate-400">Connect through conversations</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode("signin")
              setStep("basic")
              setError("")
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              mode === "signin" ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode("signup")
              setStep("basic")
              setError("")
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              mode === "signup" ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
          {mode === "signin" ? (
            <form onSubmit={handleSigninSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-50 mb-6">Welcome Back</h2>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-3 rounded text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={signinData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={signinData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          ) : step === "basic" ? (
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-50 mb-6">Create Your Account</h2>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-3 rounded text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold">
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold text-slate-50 mb-6">Complete Your Profile</h2>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-3 rounded text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  className="w-full bg-slate-800 border border-slate-700 rounded text-slate-50 placeholder-slate-500 p-2 text-sm"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">City of Birth</label>
                <Input
                  type="text"
                  name="cityOfBirth"
                  value={formData.cityOfBirth}
                  onChange={handleChange}
                  placeholder="Your city"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Birthday</label>
                <Input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Zodiac</label>
                <Input
                  type="text"
                  name="zodiac"
                  value={formData.zodiac}
                  onChange={handleChange}
                  placeholder="Your zodiac sign"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mother Tongue</label>
                <Input
                  type="text"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                  placeholder="Your language"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded text-slate-50 p-2"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current City</label>
                <Input
                  type="text"
                  name="currentCity"
                  value={formData.currentCity}
                  onChange={handleChange}
                  placeholder="Where you live now"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">School/College</label>
                <Input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Your school or college"
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  onClick={() => setStep("basic")}
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleReset}
            disabled={resetLoading}
            className="text-xs text-slate-600 hover:text-red-500 transition-colors"
          >
            {resetLoading ? "Resetting..." : "Dev: Reset App Data (Fix Login Issues)"}
          </button>
        </div>
      </div>
    </div>
  )
}
