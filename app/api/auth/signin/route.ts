import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for:", email)

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`SELECT * FROM users WHERE email = ${email}`

    if (result.length === 0) {
      console.log("[v0] User not found")
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = result[0]

    console.log("[v0] Password check match:", user.password_hash === password)

    if (user.password_hash !== password) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return Response.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        cityOfBirth: user.city_of_birth,
        birthday: user.birthday,
        zodiac: user.zodiac,
        motherTongue: user.mother_tongue,
        gender: user.gender,
        currentCity: user.current_city,
        school: user.school,
        avatar: user.avatar_initials,
      },
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return Response.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
