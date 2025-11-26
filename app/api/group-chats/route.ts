import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const groupChats = await sql`
      SELECT 
        gc.id, gc.name, gc.description, gc.is_public as "isPrivate",
        gc.created_by as "createdBy", gc.created_at as "createdAt",
        COUNT(DISTINCT gcm.user_id)::int as member_count,
        COALESCE(
          json_agg(DISTINCT gcm.user_id) FILTER (WHERE gcm.user_id IS NOT NULL),
          '[]'
        ) as members
      FROM group_chats gc
      LEFT JOIN group_chat_members gcm ON gc.id = gcm.group_chat_id
      GROUP BY gc.id
      ORDER BY gc.created_at DESC
    `
    
    // Transform isPrivate (is_public in DB is inverted)
    const transformed = groupChats.map((chat: any) => ({
      ...chat,
      isPrivate: !chat.isPrivate,
      members: Array.isArray(chat.members) ? chat.members : []
    }))
    
    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Error fetching group chats:", error)
    return NextResponse.json(
      { error: "Failed to fetch group chats" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, isPrivate, userId } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Chat name is required" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO group_chats (id, name, description, is_public, created_by)
      VALUES (${chatId}, ${name}, ${description || ""}, ${!isPrivate}, ${userId})
    `

    // Add creator as member
    const memberId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await sql`
      INSERT INTO group_chat_members (id, group_chat_id, user_id)
      VALUES (${memberId}, ${chatId}, ${userId})
    `

    return NextResponse.json(
      { id: chatId, message: "Group chat created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating group chat:", error)
    return NextResponse.json(
      { error: "Failed to create group chat" },
      { status: 500 }
    )
  }
}
