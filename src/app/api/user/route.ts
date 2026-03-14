import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'user.json')

// 确保数据目录存在
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 初始化默认数据
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({
    id: '1',
    name: '用户',
    gender: 'male',
    weight: 70,
    height: 170,
    age: 30,
    goal: 'lose_fat',
    targetCalories: 2000,
    createdAt: new Date().toISOString()
  }, null, 2))
}

export async function GET() {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read user data' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const currentData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    const updatedData = { ...currentData, ...body, updatedAt: new Date().toISOString() }
    fs.writeFileSync(dataFile, JSON.stringify(updatedData, null, 2))
    return NextResponse.json(updatedData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 })
  }
}
