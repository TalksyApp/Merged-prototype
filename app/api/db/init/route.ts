import { initializeDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await initializeDatabase()
    return NextResponse.json(
      { message: "Database initialized successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("DB init error:", error)
    return NextResponse.json(
      { error: "Failed to initialize database", details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await initializeDatabase()
    return NextResponse.json(
      { message: "Database initialized successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("DB init error:", error)
    return NextResponse.json(
      { error: "Failed to initialize database", details: String(error) },
      { status: 500 }
    )
  }
}
