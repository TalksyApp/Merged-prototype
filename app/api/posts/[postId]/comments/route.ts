import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params

    const comments = await db.query(
      `SELECT 
        c.id,
        c.user_id,
        c.content,
        c.created_at,
        u.username,
        u.avatar_initials
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC`,
      [postId]
    )

    console.log('Raw comments from DB:', comments.rows)

    const formattedComments = comments.rows.map((comment: any) => ({
      id: comment.id,
      userId: comment.user_id,
      author: comment.username || 'Unknown',
      handle: `@${comment.username || 'unknown'}`,
      avatar: comment.avatar_initials || (comment.username ? comment.username[0] : 'U'),
      content: comment.content,
      timestamp: new Date(comment.created_at).getTime(),
      likes: []
    }))

    console.log('Formatted comments:', formattedComments)

    return NextResponse.json(formattedComments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params
    const body = await request.json()
    const { content, userId } = body

    console.log('=== CREATING COMMENT ===')
    console.log('Post ID:', postId)
    console.log('User ID:', userId)
    console.log('Content:', content)
    console.log('Full body:', body)

    if (!content || !userId) {
      console.error('Missing required fields:', { content: !!content, userId: !!userId })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    console.log('Checking if user exists...')
    const userCheck = await db.query('SELECT id, username FROM users WHERE id = $1', [userId])
    console.log('User check result:', userCheck.rows)

    if (userCheck.rows.length === 0) {
      console.error('User not found:', userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    console.log('Generated comment ID:', commentId)
    
    console.log('Inserting comment into database...')
    const result = await db.query(
      `INSERT INTO comments (id, post_id, user_id, content, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      [commentId, postId, userId, content]
    )

    console.log('Insert result:', result)
    console.log('Comment created with ID:', result.rows[0]?.id)

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 })
  } catch (error) {
    console.error("=== ERROR CREATING COMMENT ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Failed to create comment",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
