import { neon } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return process.env.DATABASE_URL
}

export const sql = neon(getDatabaseUrl())

// Create a pool for parameterized queries
const pool = new Pool({ connectionString: getDatabaseUrl() })

// Export db object with query method for compatibility
export const db = {
  query: async (text: string, params: any[] = []) => {
    console.log('Executing query:', text)
    console.log('With params:', params)
    
    const client = await pool.connect()
    try {
      const result = await client.query(text, params)
      console.log('Query result rows:', result.rows)
      return result
    } finally {
      client.release()
    }
  }
}

export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        bio TEXT,
        avatar TEXT,
        avatar_initials TEXT,
        birthday TEXT,
        zodiac TEXT,
        gender TEXT,
        mother_tongue TEXT,
        current_city TEXT,
        city_of_birth TEXT,
        school TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        tags TEXT[] DEFAULT '{}',
        is_boosted BOOLEAN DEFAULT false,
        frequency_type TEXT DEFAULT 'standard',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create topics table
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_by TEXT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create topic subscriptions
    await sql`
      CREATE TABLE IF NOT EXISTS topic_subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, topic_id)
      )
    `

    // Create group chats table
    await sql`
      CREATE TABLE IF NOT EXISTS group_chats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT true,
        created_by TEXT NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create group chat members
    await sql`
      CREATE TABLE IF NOT EXISTS group_chat_members (
        id TEXT PRIMARY KEY,
        group_chat_id TEXT NOT NULL REFERENCES group_chats(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_chat_id, user_id)
      )
    `

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        group_chat_id TEXT REFERENCES group_chats(id) ON DELETE CASCADE,
        topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
        recipient_id TEXT REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create private chats table
    await sql`
      CREATE TABLE IF NOT EXISTS private_chats (
        id TEXT PRIMARY KEY,
        participant1_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        participant2_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(participant1_id, participant2_id)
      )
    `

    // Create likes table
    await sql`
      CREATE TABLE IF NOT EXISTS likes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id)
      )
    `

    // Create comments table
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}
