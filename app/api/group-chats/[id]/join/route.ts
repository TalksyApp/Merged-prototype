import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()
    const chatId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if already a member
    const existing = await sql`
      SELECT id FROM group_chat_members
      WHERE group_chat_id = ${chatId} AND user_id = ${userId}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Already a member" },
        { status: 200 }
      )
    }

    const memberId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await sql`
      INSERT INTO group_chat_members (id, group_chat_id, user_id)
      VALUES (${memberId}, ${chatId}, ${userId})
    `

    return NextResponse.json(
      { message: "Joined group chat successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error joining group chat:", error)
    return NextResponse.json(
      { error: "Failed to join group chat" },
      { status: 500 }
    )
  }
}
