import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    
    const result = await sql`
      SELECT 
        p.*,
        u.username,
        u.avatar_initials,
        COUNT(DISTINCT l.id)::int as likes_count,
        COUNT(DISTINCT c.id)::int as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.id = ${postId}
      GROUP BY p.id, u.username, u.avatar_initials
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
