import { NextRequest, NextResponse } from "next/server"

// This route is deprecated - use NextAuth credentials provider instead
// Keeping it for backward compatibility
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Please use the /auth page for authentication" },
    { status: 410 }
  )
}
