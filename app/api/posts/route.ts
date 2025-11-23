import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const posts = await sql`
      SELECT 
        p.id, p.content, p.created_at,
        u.username, u.avatar_initials,
        COUNT(l.id)::int as likes
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      GROUP BY p.id, u.username, u.avatar_initials
      ORDER BY p.created_at DESC
      LIMIT 50
    `
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, userId } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Generate ID without crypto module
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO posts (id, user_id, content, created_at)
      VALUES (${postId}, ${userId}, ${content}, NOW())
    `

    return NextResponse.json(
      { id: postId, message: "Post created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
