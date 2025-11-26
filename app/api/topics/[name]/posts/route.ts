import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const topicName = decodeURIComponent(params.name)

    const posts = await sql`
      SELECT 
        p.id, p.content, p.tags, p.created_at,
        u.username, u.avatar_initials,
        COUNT(l.id)::int as likes
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE ${topicName} = ANY(p.tags)
      GROUP BY p.id, u.username, u.avatar_initials
      ORDER BY p.created_at DESC
      LIMIT 50
    `

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching topic posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch topic posts" },
      { status: 500 }
    )
  }
}
