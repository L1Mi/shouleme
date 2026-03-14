import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'records.json')

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    
    if (date) {
      const filtered = data.filter((r: any) => r.date === date)
      return NextResponse.json(filtered)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read records' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    
    const newRecord = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    data.unshift(newRecord)
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
    
    return NextResponse.json(newRecord)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add record' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    
    let data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    data = data.filter((r: any) => r.id !== id)
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
  }
}
