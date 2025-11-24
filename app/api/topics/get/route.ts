import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const topics = await sql`
      SELECT 
        t.*,
        COUNT(DISTINCT ts.user_id) as subscribers_count
      FROM topics t
      LEFT JOIN topic_subscriptions ts ON t.id = ts.topic_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `

    return NextResponse.json(topics)
  } catch (error) {
    console.error("Topics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 })
  }
}
