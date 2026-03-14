import { NextResponse } from 'next/server'

// 内存存储
let records: any[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  
  if (date) {
    return NextResponse.json(records.filter(r => r.date === date))
  }
  return NextResponse.json(records)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newRecord = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    records.unshift(newRecord)
    return NextResponse.json(newRecord)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add record' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (id) {
    records = records.filter(r => r.id !== id)
  }
  return NextResponse.json({ success: true })
}
