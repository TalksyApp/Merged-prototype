export interface User {
  id: string
  username: string
  email: string
  bio: string
  cityOfBirth: string
  birthday: string
  zodiac: string
  motherTongue: string
  gender: string
  currentCity: string
  school: string
  avatar: string
}

export interface Post {
  id: string
  userId: string
  content: string
  timestamp: number
  likes: string[]
  replies: string[]
}

export interface Topic {
  id: string
  name: string
  description: string
  members: string[]
  posts: string[]
  createdBy: string
  createdAt: number
}

export interface GroupChat {
  id: string
  name: string
  description: string
  isPrivate: boolean
  members: string[]
  messages: ChatMessage[]
  createdBy: string
  createdAt: number
}

export interface ChatMessage {
  id: string
  userId: string
  content: string
  timestamp: number
}

export interface PrivateChat {
  id: string
  participants: string[]
  messages: ChatMessage[]
  lastMessage: number
}

const STORAGE_KEYS = {
  CURRENT_USER: "talksy_current_user",
  USERS: "talksy_users",
  POSTS: "talksy_posts",
  TOPICS: "talksy_topics",
  GROUP_CHATS: "talksy_group_chats",
  PRIVATE_CHATS: "talksy_private_chats",
}

export const storage = {
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return user ? JSON.parse(user) : null
  },

  setCurrentUser: (user: User) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  },

  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(STORAGE_KEYS.USERS)
    return users ? JSON.parse(users) : []
  },

  addUser: (user: User) => {
    if (typeof window === "undefined") return
    const users = storage.getUsers()
    users.push(user)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  },

  getPosts: (): Post[] => {
    if (typeof window === "undefined") return []
    const posts = localStorage.getItem(STORAGE_KEYS.POSTS)
    return posts ? JSON.parse(posts) : []
  },

  addPost: (post: Post) => {
    if (typeof window === "undefined") return
    const posts = storage.getPosts()
    posts.push(post)
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
  },

  getTopics: (): Topic[] => {
    if (typeof window === "undefined") return []
    const topics = localStorage.getItem(STORAGE_KEYS.TOPICS)
    return topics ? JSON.parse(topics) : []
  },

  addTopic: (topic: Topic) => {
    if (typeof window === "undefined") return
    const topics = storage.getTopics()
    topics.push(topic)
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics))
  },

  getGroupChats: (): GroupChat[] => {
    if (typeof window === "undefined") return []
    const chats = localStorage.getItem(STORAGE_KEYS.GROUP_CHATS)
    return chats ? JSON.parse(chats) : []
  },

  addGroupChat: (chat: GroupChat) => {
    if (typeof window === "undefined") return
    const chats = storage.getGroupChats()
    chats.push(chat)
    localStorage.setItem(STORAGE_KEYS.GROUP_CHATS, JSON.stringify(chats))
  },

  updateGroupChat: (chatId: string, updates: Partial<GroupChat>) => {
    if (typeof window === "undefined") return
    const chats = storage.getGroupChats()
    const index = chats.findIndex((c) => c.id === chatId)
    if (index !== -1) {
      chats[index] = { ...chats[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.GROUP_CHATS, JSON.stringify(chats))
    }
  },

  getPrivateChats: (): PrivateChat[] => {
    if (typeof window === "undefined") return []
    const chats = localStorage.getItem(STORAGE_KEYS.PRIVATE_CHATS)
    return chats ? JSON.parse(chats) : []
  },

  addPrivateChat: (chat: PrivateChat) => {
    if (typeof window === "undefined") return
    const chats = storage.getPrivateChats()
    chats.push(chat)
    localStorage.setItem(STORAGE_KEYS.PRIVATE_CHATS, JSON.stringify(chats))
  },

  updatePrivateChat: (chatId: string, updates: Partial<PrivateChat>) => {
    if (typeof window === "undefined") return
    const chats = storage.getPrivateChats()
    const index = chats.findIndex((c) => c.id === chatId)
    if (index !== -1) {
      chats[index] = { ...chats[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.PRIVATE_CHATS, JSON.stringify(chats))
    }
  },
}
