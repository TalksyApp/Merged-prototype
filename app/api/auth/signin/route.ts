import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Query user by email
    const result = await sql(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    if (result.length === 0) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const user = result[0]

    // In production, use bcrypt. For now, simple comparison
    if (user.password !== password) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
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
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return Response.json(
      { error: "Failed to sign in" },
      { status: 500 }
    )
  }
}
