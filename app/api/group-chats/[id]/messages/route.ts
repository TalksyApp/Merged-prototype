import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id

    const messages = await sql`
      SELECT 
        m.id, m.content, m.created_at as timestamp,
        m.user_id as "userId",
        u.username, u.avatar_initials
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.group_chat_id = ${chatId}
      ORDER BY m.created_at ASC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, userId } = await request.json()
    const chatId = params.id

    if (!content || !userId) {
      return NextResponse.json(
        { error: "Content and userId are required" },
        { status: 400 }
      )
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO messages (id, user_id, group_chat_id, content)
      VALUES (${messageId}, ${userId}, ${chatId}, ${content})
    `

    return NextResponse.json(
      { id: messageId, message: "Message sent successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
