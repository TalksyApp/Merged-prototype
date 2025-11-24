"use client"
import { useState, useEffect } from "react"
import type { User } from "@/lib/storage"
import { Search, Zap, TrendingUp } from "lucide-react"

interface ExplorePageProps {
  currentUser: User
  selectedTopic: string | null
  onTopicSelect: (topicId: string | null) => void
}

interface Topic {
  id: string
  name: string
  description: string
  subscribers_count: number
  created_at: string
}

export default function ExplorePage({ currentUser, selectedTopic, onTopicSelect }: ExplorePageProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/topics/get")
      const data = await response.json()
      setTopics(data)
    } catch (error) {
      console.error("Failed to fetch topics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock featured topics if database is empty for design purposes
  const featuredTopics = [
    { id: "1", name: "The Digital Void", category: "PHILOSOPHY", gradient: "from-indigo-900 to-purple-900" },
    { id: "2", name: "Neon Nights", category: "PHOTOGRAPHY", gradient: "from-purple-900 to-pink-900" },
    { id: "3", name: "Code Art", category: "DEVELOPMENT", gradient: "from-blue-900 to-cyan-900" },
  ]

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto pt-10 px-6 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Explore</h1>
          <p className="text-gray-500">Find your frequency in the noise.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, topics, or keywords..."
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700]/30 transition-all"
          />
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
            <h2 className="text-xl font-bold text-white">Featured</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onTopicSelect(topic.id)}
                className={`h-48 rounded-2xl p-6 flex flex-col justify-end cursor-pointer transition-transform hover:scale-[1.02] bg-gradient-to-br ${topic.gradient} relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-white/70 tracking-widest uppercase mb-1">{topic.category}</p>
                  <h3 className="text-2xl font-bold text-white">{topic.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#FF4444]" />
            <h2 className="text-xl font-bold text-white">Trending Now</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Cyberpunk", "Void", "Design", "React", "Space", "Minimalism", "AI", "Music", "NightLife"].map((tag) => (
              <div
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333] px-4 py-2 rounded-full cursor-pointer transition-colors"
              >
                <span className="text-gray-400 font-medium">#{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
