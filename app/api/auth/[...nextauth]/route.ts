// This route is not used in preview but will be needed for production with proper NextAuth

export const dynamic = "force-dynamic"

export async function GET() {
  return new Response("NextAuth API routes not available in preview. Use localStorage-based auth instead.", {
    status: 501,
  })
}

export async function POST() {
  return new Response("NextAuth API routes not available in preview. Use localStorage-based auth instead.", {
    status: 501,
  })
}
