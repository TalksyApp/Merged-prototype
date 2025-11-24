import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const topicId = searchParams.get("topicId")

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 })
    }

    const messages = await sql`
      SELECT 
        m.*,
        u.username,
        u.avatar_initials
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.topic_id = ${topicId}
      ORDER BY m.created_at ASC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
