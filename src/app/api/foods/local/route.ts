import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'chinese_foods.json')

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
  'broccoli': '西蓝花',
  'cucumber': '黄瓜',
  'onion': '洋葱',
  'garlic': '大蒜',
  'ginger': '生姜',
  'corn': '玉米',
  'rice': '米饭',
  'noodles': '面条',
  'bread': '面包',
  'cake': '蛋糕',
  'cookie': '饼干',
  'chocolate': '巧克力',
  'coffee': '咖啡',
  'milk': '牛奶',
  'yogurt': '酸奶',
  'juice': '果汁',
  'cola': '可乐',
  'sprite': '雪碧',
  'beer': '啤酒',
  'wine': '葡萄酒',
  'tea': '茶',
  'egg': '鸡蛋',
  'chicken': '鸡肉',
  'beef': '牛肉',
  'pork': '猪肉',
  'fish': '鱼',
  'shrimp': '虾',
  'crab': '螃蟹',
  'tofu': '豆腐',
  'milk tea': '奶茶',
  'hamburger': '汉堡',
  'pizza': '披萨',
  'fried rice': '炒饭',
  'dumplings': '饺子',
  'baozi': '馒头',
  'steamed buns': '包子',
  'hot dog': '热狗',
  'sandwich': '三明治',
  'salad': '沙拉',
  'soup': '汤',
  'fried chicken': '炸鸡',
  'chicken wing': '鸡翅',
  'chicken leg': '鸡腿',
  'steak': '牛排',
  'sausage': '香肠',
  'bacon': '培根',
  'cheese': '奶酪',
  'butter': '黄油',
  'ice cream': '冰淇淋',
  'chips': '薯片',
  'peanuts': '花生',
  'nuts': '坚果',
  'walnut': '核桃',
  'almond': '杏仁',
  'cookies': '饼干',
  'pudding': '布丁',
  'jam': '果酱',
  'honey': '蜂蜜',
  'sugar': '糖',
  'salt': '盐',
  'soy sauce': '酱油',
  'vinegar': '醋',
  'oil': '油',
  'rice': '米饭',
  'congee': '粥',
  'steamed rice': '米饭',
  'fried noodles': '炒面',
  'ramen': '拉面',
  'spaghetti': '意面',
  'lasagna': '千层面',
  'meat': '肉',
  'vegetable': '蔬菜',
  'fruit': '水果',
  'egg': '鸡蛋',
  'tofu': '豆腐',
  'milk': '牛奶',
  'cheese': '奶酪',
  'yogurt': '酸奶',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('q') || ''
    
    let data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    let foods = data.foods || []
    
    // 先尝试直接匹配
    let results = foods.filter((f: any) => 
      f.name.toLowerCase().includes(keyword.toLowerCase())
    )
    
    // 如果没匹配到，尝试翻译
    if (results.length === 0) {
      const chineseName = foodTranslation[keyword.toLowerCase()]
      if (chineseName) {
        results = foods.filter((f: any) => 
          f.name.includes(chineseName)
        )
      }
    }
    
    // 如果还没匹配到，尝试翻译识别结果中的第一个词
    if (results.length === 0 && keyword) {
      const eng = keyword.toLowerCase().split(' ')[0]
      const chineseName = foodTranslation[eng]
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
