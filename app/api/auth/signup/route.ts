import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()

    const body = await request.json()
    const { email, username, password, bio, cityOfBirth, birthday, zodiac, motherTongue, gender, currentCity, school } =
      body

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email} OR username = ${username}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const userId = generateId()
    const avatarInitials = username.substring(0, 2).toUpperCase()
    
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10)

    await sql`
      INSERT INTO users (
        id,
        username,
        email,
        password_hash,
        avatar_initials,
        bio,
        city_of_birth,
        birthday,
        zodiac,
        mother_tongue,
        gender,
        current_city,
        school
      )
      VALUES (
        ${userId},
        ${username},
        ${email},
        ${hashedPassword},
        ${avatarInitials},
        ${bio || null},
        ${cityOfBirth || null},
        ${birthday || null},
        ${zodiac || null},
        ${motherTongue || null},
        ${gender || null},
        ${currentCity || null},
        ${school || null}
      )
    `

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: userId,
          username,
          email,
          bio,
          cityOfBirth,
          birthday,
          zodiac,
          motherTongue,
          gender,
          currentCity,
          school,
          avatar: avatarInitials,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
