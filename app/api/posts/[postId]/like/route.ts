import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if already liked
    const existing = await sql`
      SELECT id FROM likes 
      WHERE user_id = ${userId} AND post_id = ${postId}
    `

    if (existing.length > 0) {
      // Unlike
      await sql`
        DELETE FROM likes 
        WHERE user_id = ${userId} AND post_id = ${postId}
      `
      return NextResponse.json({ liked: false })
    } else {
      // Like
      const likeId = `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await sql`
        INSERT INTO likes (id, user_id, post_id, created_at)
        VALUES (${likeId}, ${userId}, ${postId}, NOW())
      `
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
