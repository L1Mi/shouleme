import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'chinese_foods.json')

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    
    let data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    let foods = data.foods || []
    
    // 按关键词搜索
    if (keyword) {
      const kw = keyword.toLowerCase()
      foods = foods.filter((f: any) => 
        f.name.toLowerCase().includes(kw) || 
        f.category.toLowerCase().includes(kw)
      )
    }
    
    // 按分类筛选
    if (category) {
      foods = foods.filter((f: any) => f.category === category)
    }
    
    // 返回前20条
    return NextResponse.json(foods.slice(0, 20))
  } catch (error) {
    console.error('Local food API error:', error)
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 })
  }
}

// 获取所有分类
export async function POST(request: Request) {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    const categories = Array.from(new Set(data.foods.map((f: any) => f.category)))
    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get categories' }, { status: 500 })
  }
}
