import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Drop all tables to start fresh
    await sql`DROP TABLE IF EXISTS messages CASCADE`
    await sql`DROP TABLE IF EXISTS group_chat_members CASCADE`
    await sql`DROP TABLE IF EXISTS group_chats CASCADE`
    await sql`DROP TABLE IF EXISTS topic_subscriptions CASCADE`
    await sql`DROP TABLE IF EXISTS topics CASCADE`
    await sql`DROP TABLE IF EXISTS likes CASCADE`
    await sql`DROP TABLE IF EXISTS posts CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`

    // Re-initialize the database
    await initializeDatabase()

    return NextResponse.json({ message: "Database reset successfully" })
  } catch (error) {
    console.error("Reset error:", error)
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 })
  }
}
