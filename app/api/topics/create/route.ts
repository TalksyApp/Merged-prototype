import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, userId } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Topic name is required" }, { status: 400 })
    }

    const topicId = `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const result = await sql`
      INSERT INTO topics (id, name, description)
      VALUES (${topicId}, ${name}, ${description || ""})
      RETURNING *
    `

    // Subscribe creator to the topic
    if (userId) {
      const subId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await sql`
        INSERT INTO topic_subscriptions (id, user_id, topic_id)
        VALUES (${subId}, ${userId}, ${topicId})
      `
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Topic creation error:", error)
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 })
  }
}
