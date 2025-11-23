import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const postId = params.id

    // Check if already liked
    const existingLike = await sql`
      SELECT id FROM likes 
      WHERE user_id = ${userId} AND post_id = ${postId}
    `

    if (existingLike.length > 0) {
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
        INSERT INTO likes (id, user_id, post_id)
        VALUES (${likeId}, ${userId}, ${postId})
      `
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error liking post:", error)
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    )
  }
}
