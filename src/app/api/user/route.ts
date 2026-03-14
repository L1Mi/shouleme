import { NextResponse } from 'next/server'

// 用户默认数据
const defaultUser = {
  id: '1',
  name: '用户',
  gender: 'male',
  weight: 70,
  height: 170,
  age: 30,
  goal: 'lose_fat',
  targetCalories: 2000,
}

export async function GET() {
  return NextResponse.json(defaultUser)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ ...defaultUser, ...body })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 })
  }
}
