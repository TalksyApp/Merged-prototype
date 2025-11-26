import { sql } from "@/lib/db"
import { initializeDatabase } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await initializeDatabase()
    const { userId } = await params

    const users = await sql`
      SELECT 
        id,
        username,
        email,
        bio,
        city_of_birth as "cityOfBirth",
        birthday,
        zodiac,
        mother_tongue as "motherTongue",
        gender,
        current_city as "currentCity",
        school,
        avatar_initials as avatar
      FROM users
      WHERE id = ${userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}
