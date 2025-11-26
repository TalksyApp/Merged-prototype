import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = await sql`
      SELECT 
        id, username, email, bio, avatar, avatar_initials,
        birthday, zodiac, gender, mother_tongue, current_city,
        city_of_birth, school, created_at
      FROM users
      ORDER BY created_at DESC
    `
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
