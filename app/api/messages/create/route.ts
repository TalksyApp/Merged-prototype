import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, content, topicId, groupChatId } = body

    if (!userId || !content?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const result = await sql`
      INSERT INTO messages (id, user_id, content, topic_id, group_chat_id)
      VALUES (${messageId}, ${userId}, ${content}, ${topicId || null}, ${groupChatId || null})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Message creation error:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
