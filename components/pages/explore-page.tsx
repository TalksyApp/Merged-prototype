"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { storage, type User, type Topic } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TopicCard from "@/components/topic-card"
import TopicDetail from "@/components/topic-detail"
import { Plus, Search } from 'lucide-react'

interface ExplorePageProps {
  currentUser: User
  selectedTopic: string | null
  onTopicSelect: (topicId: string | null) => void
}

const DEFAULT_TOPICS = [
  { name: "Gadgets & Tech News", description: "Latest tech gadgets and news" },
  { name: "Data Visualization", description: "Data visualization techniques and tools" },
  { name: "Social Media Trends", description: "Trending topics on social media" },
  { name: "Climate & Environment", description: "Environmental issues and solutions" },
  { name: "Mental Health & Self-Care", description: "Mental wellness and self-care tips" },
  { name: "Career & Work-Life Balance", description: "Career advice and work-life balance" },
  { name: "Education & Learning", description: "Educational resources and learning" },
  { name: "Childhood Memories", description: "Share your childhood memories" },
  { name: "Dating & Relationships", description: "Relationship advice and dating" },
  { name: "Family & Culture", description: "Family and cultural discussions" },
  { name: "Friendships & Social Dynamics", description: "Friendship and social topics" },
  { name: "TV Shows & Movies", description: "Discuss your favorite shows and movies" },
  { name: "Music & Podcasts", description: "Music recommendations and podcasts" },
  { name: "Video Games", description: "Gaming discussions and reviews" },
  { name: "Books & Comics", description: "Book and comic recommendations" },
  { name: "Travel Destinations", description: "Travel tips and destination guides" },
  { name: "Food & Cooking", description: "Recipes and cooking tips" },
  { name: "Fitness & Wellness", description: "Fitness routines and wellness" },
  { name: "Fashion & Style", description: "Fashion tips and style advice" },
  { name: "DIY & Home Decor", description: "DIY projects and home decoration" },
]

export default function ExplorePage({ currentUser, selectedTopic, onTopicSelect }: ExplorePageProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTopicName, setNewTopicName] = useState("")
  const [newTopicDesc, setNewTopicDesc] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedTopics = storage.getTopics()
    if (storedTopics.length === 0) {
      const defaultTopics = DEFAULT_TOPICS.map((t, i) => ({
        id: `topic-${i}`,
        name: t.name,
        description: t.description,
        members: [],
        posts: [],
        createdBy: "system",
        createdAt: Date.now(),
      }))
      defaultTopics.forEach((t) => storage.addTopic(t))
      setTopics(defaultTopics)
    } else {
      setTopics(storedTopics)
    }
    setIsLoading(false)
  }, [])

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicName.trim()) return

    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName,
      description: newTopicDesc,
      members: [currentUser.id],
      posts: [],
      createdBy: currentUser.id,
      createdAt: Date.now(),
    }

    storage.addTopic(newTopic)
    setTopics([...topics, newTopic])
    setNewTopicName("")
    setNewTopicDesc("")
    setShowCreateForm(false)
  }

  const handleJoinTopic = (topicId: string) => {
    setTopics(
      topics.map((topic) => {
        if (topic.id === topicId && !topic.members.includes(currentUser.id)) {
          return { ...topic, members: [...topic.members, currentUser.id] }
        }
        return topic
      }),
    )
  }

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (selectedTopic) {
    const topic = topics.find((t) => t.id === selectedTopic)
    if (!topic) return null

    return <TopicDetail topic={topic} currentUser={currentUser} onBack={() => onTopicSelect(null)} />
  }

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Explore Topics
          </h2>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 glow-pulse"
          >
            <Plus className="w-4 h-4" />
            Create Topic
          </Button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground backdrop-blur-sm"
          />
        </div>

        {showCreateForm && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 backdrop-blur-sm">
            <form onSubmit={handleCreateTopic} className="space-y-3">
              <Input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Topic name"
                className="bg-input border-border text-foreground placeholder-muted-foreground"
                required
              />
              <textarea
                value={newTopicDesc}
                onChange={(e) => setNewTopicDesc(e.target.value)}
                placeholder="Topic description"
                className="w-full bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground p-2"
                rows={2}
              />
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Create
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-card"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading topics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                currentUser={currentUser}
                onSelect={() => onTopicSelect(topic.id)}
                onJoin={() => handleJoinTopic(topic.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
