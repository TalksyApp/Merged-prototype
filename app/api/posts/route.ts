import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    const posts = await sql`
      SELECT 
        p.id, p.content, p.created_at, p.user_id, p.tags, p.is_boosted,
        u.username, u.avatar_initials,
        COUNT(DISTINCT l.id)::int as likes_count,
        COUNT(DISTINCT c.id)::int as comments_count,
        ${userId ? sql`EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${userId})` : sql`false`} as is_liked_by_user
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id, p.content, p.created_at, p.user_id, p.tags, p.is_boosted, u.username, u.avatar_initials
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
    const { content, userId, tags, isBoosted } = await request.json()

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

    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO posts (id, user_id, content, tags, is_boosted, created_at)
      VALUES (${postId}, ${userId}, ${content}, ${tags || []}, ${isBoosted || false}, NOW())
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
