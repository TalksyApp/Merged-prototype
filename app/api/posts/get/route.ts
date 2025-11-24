import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const posts = await sql`
      SELECT 
        p.*,
        u.username,
        u.avatar_initials,
        COUNT(DISTINCT l.id) as likes_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
