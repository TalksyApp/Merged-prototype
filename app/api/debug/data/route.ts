import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const users = await sql`SELECT * FROM users LIMIT 10`

    return Response.json({
      status: "connected",
      users: users,
      message: "Successfully connected to Neon",
    })
  } catch (error: any) {
    return Response.json(
      {
        status: "error",
        error: error.message,
        message: "Failed to connect to Neon",
      },
      { status: 500 },
    )
  }
}
