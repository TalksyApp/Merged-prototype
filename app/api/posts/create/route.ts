import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, content, tags = [], frequencyType = "standard", isPromoted = false } = body

    if (!userId || !content?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const result = await sql`
      INSERT INTO posts (id, user_id, content, tags, frequency_type, is_promoted)
      VALUES (${postId}, ${userId}, ${content}, ${tags}, ${frequencyType}, ${isPromoted})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
