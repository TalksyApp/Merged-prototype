import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const topics = await sql`
      SELECT 
        t.id, t.name, t.description,
        COUNT(DISTINCT ts.user_id)::int as members
      FROM topics t
      LEFT JOIN topic_subscriptions ts ON t.id = ts.topic_id
      GROUP BY t.id
      ORDER BY t.name
    `
    return NextResponse.json(topics)
  } catch (error) {
    console.error("Error fetching topics:", error)
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, userId } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Topic name is required" },
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
    const topicId = `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO topics (id, name, description)
      VALUES (${topicId}, ${name}, ${description || ""})
    `

    // Auto-subscribe creator
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await sql`
      INSERT INTO topic_subscriptions (id, user_id, topic_id)
      VALUES (${subscriptionId}, ${userId}, ${topicId})
    `

    return NextResponse.json(
      { id: topicId, message: "Topic created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating topic:", error)
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    )
  }
}
