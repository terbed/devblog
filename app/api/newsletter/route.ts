import { NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/newsletter'

export async function POST(req: Request) {
  let email: unknown
  try {
    ;({ email } = await req.json())
  } catch {
    return NextResponse.json({ error: true, message: 'Invalid request body.' }, { status: 400 })
  }

  const { statusCode, body } = await subscribeToNewsletter(email)
  return NextResponse.json(body, { status: statusCode })
}
