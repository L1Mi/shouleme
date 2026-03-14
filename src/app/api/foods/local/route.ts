import { NextResponse } from 'next/server'
import { foods } from './foods'

// 中英文对照表
const foodTranslation: Record<string, string> = {
  'apple': '苹果',
  'banana': '香蕉',
  'orange': '橙子',
  'watermelon': '西瓜',
  'grape': '葡萄',
  'mango': '芒果',
  'peach': '桃子',
  'pear': '梨',
  'pineapple': '菠萝',
  'strawberry': '草莓',
  'tomato': '西红柿',
  'potato': '土豆',
  'carrot': '胡萝卜',
  'cabbage': '白菜',
  'lettuce': '生菜',
  'spinach': '菠菜',
  'broccoli': '西兰花',
  'cucumber': '黄瓜',
  'onion': '洋葱',
  'rice': '米饭',
  'noodles': '面条',
  'bread': '面包',
  'cake': '蛋糕',
  'coffee': '咖啡',
  'milk': '牛奶',
  'yogurt': '酸奶',
  'juice': '果汁',
  'cola': '可乐',
  'egg': '鸡蛋',
  'chicken': '鸡肉',
  'beef': '牛肉',
  'pork': '猪肉',
  'fish': '鱼',
  'shrimp': '虾',
  'tofu': '豆腐',
  'milk tea': '奶茶',
  'hamburger': '汉堡',
  'pizza': '披萨',
  'fries': '薯条',
  'fried chicken': '炸鸡',
  'sandwich': '三明治',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('q') || ''
    const kw = keyword.toLowerCase()
    
    let results = foods.filter((f: any) => 
      f.name.toLowerCase().includes(kw)
    )
    
    // 如果没匹配到，尝试翻译
    if (results.length === 0) {
      const chineseName = foodTranslation[kw]
      if (chineseName) {
        results = foods.filter((f: any) => 
          f.name.includes(chineseName)
        )
      }
    }
    
    return NextResponse.json(results.slice(0, 20))
  } catch (error) {
    console.error('Local food API error:', error)
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 })
  }
}
