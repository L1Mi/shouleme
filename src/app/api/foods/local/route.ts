import { NextResponse } from 'next/server'

// 中英文对照表
const foodTranslation: Record<string, string> = {
  'apple': '苹果', 'banana': '香蕉', 'orange': '橙子', 'watermelon': '西瓜',
  'grape': '葡萄', 'mango': '芒果', 'peach': '桃子', 'pear': '梨',
  'pineapple': '菠萝', 'strawberry': '草莓', 'tomato': '西红柿', 'potato': '土豆',
  'carrot': '胡萝卜', 'cabbage': '白菜', 'lettuce': '生菜', 'spinach': '菠菜',
  'broccoli': '西兰花', 'cucumber': '黄瓜', 'onion': '洋葱', 'rice': '米饭',
  'noodles': '面条', 'bread': '面包', 'cake': '蛋糕', 'coffee': '咖啡',
  'milk': '牛奶', 'yogurt': '酸奶', 'juice': '果汁', 'cola': '可乐',
  'egg': '鸡蛋', 'chicken': '鸡肉', 'beef': '牛肉', 'pork': '猪肉',
  'fish': '鱼', 'shrimp': '虾', 'tofu': '豆腐', 'milk tea': '奶茶',
  'hamburger': '汉堡', 'pizza': '披萨', 'fries': '薯条', 'fried chicken': '炸鸡',
  'sandwich': '三明治',
}

// 内嵌食物数据
const foods = [
  {id:1,name:"米饭",category:"主食",calories:116,protein:2.6,carbs:25.6,fat:0.3,serving:"100g"},
  {id:2,name:"馒头",category:"主食",calories:223,protein:7,carbs:47,fat:1,serving:"100g"},
  {id:3,name:"面条",category:"主食",calories:138,protein:4.5,carbs:25,fat:1.5,serving:"100g"},
  {id:4,name:"包子",category:"主食",calories:227,protein:9,carbs:40,fat:4,serving:"100g"},
  {id:5,name:"饺子",category:"主食",calories:253,protein:8,carbs:36,fat:8,serving:"100g"},
  {id:6,name:"粥",category:"主食",calories:46,protein:1.5,carbs:9,fat:0.5,serving:"100g"},
  {id:7,name:"炒饭",category:"主食",calories:163,protein:4.5,carbs:24,fat:5.5,serving:"100g"},
  {id:8,name:"红烧肉",category:"肉类",calories:358,protein:18,carbs:12,fat:28,serving:"100g"},
  {id:9,name:"糖醋排骨",category:"肉类",calories:298,protein:16,carbs:18,fat:18,serving:"100g"},
  {id:10,name:"宫保鸡丁",category:"肉类",calories:215,protein:20,carbs:8,fat:12,serving:"100g"},
  {id:11,name:"回锅肉",category:"肉类",calories:349,protein:14,carbs:6,fat:30,serving:"100g"},
  {id:12,name:"青椒肉丝",category:"肉类",calories:148,protein:16,carbs:8,fat:6,serving:"100g"},
  {id:13,name:"鱼香肉丝",category:"肉类",calories:181,protein:14,carbs:15,fat:8,serving:"100g"},
  {id:14,name:"牛腩",category:"肉类",calories:246,protein:19,carbs:3,fat:17,serving:"100g"},
  {id:15,name:"牛肉",category:"肉类",calories:125,protein:26,carbs:0,fat:2,serving:"100g"},
  {id:16,name:"羊肉",category:"肉类",calories:118,protein:23,carbs:0,fat:2.5,serving:"100g"},
  {id:17,name:"鸡翅",category:"肉类",calories:203,protein:18,carbs:0,fat:14,serving:"100g"},
  {id:18,name:"鸡腿",category:"肉类",calories:181,protein:20,carbs:0,fat:10,serving:"100g"},
  {id:19,name:"虾",category:"海鲜",calories:85,protein:20,carbs:0,fat:0.5,serving:"100g"},
  {id:20,name:"鱼",category:"海鲜",calories:102,protein:20,carbs:0,fat:2,serving:"100g"},
  {id:21,name:"螃蟹",category:"海鲜",calories:103,protein:19,carbs:1,fat:2,serving:"100g"},
  {id:22,name:"鱿鱼",category:"海鲜",calories:92,protein:18,carbs:2,fat:1,serving:"100g"},
  {id:23,name:"炒青菜",category:"蔬菜",calories:45,protein:3,carbs:6,fat:2,serving:"100g"},
  {id:24,name:"炒白菜",category:"蔬菜",calories:32,protein:2,carbs:5,fat:1,serving:"100g"},
  {id:25,name:"西红柿炒蛋",category:"蔬菜",calories:108,protein:6,carbs:7,fat:7,serving:"100g"},
  {id:26,name:"麻婆豆腐",category:"蔬菜",calories:168,protein:8,carbs:10,fat:11,serving:"100g"},
  {id:27,name:"炒土豆丝",category:"蔬菜",calories:120,protein:2.5,carbs:22,fat:3,serving:"100g"},
  {id:28,name:"红烧豆腐",category:"豆制品",calories:98,protein:8,carbs:4,fat:5,serving:"100g"},
  {id:29,name:"豆浆",category:"豆制品",calories:33,protein:3,carbs:2,fat:1.5,serving:"100g"},
  {id:30,name:"油条",category:"小吃",calories:386,protein:7,carbs:48,fat:18,serving:"100g"},
  {id:31,name:"煎饼",category:"小吃",calories:197,protein:5,carbs:35,fat:4,serving:"100g"},
  {id:32,name:"蛋糕",category:"小吃",calories:348,protein:6,carbs:52,fat:14,serving:"100g"},
  {id:33,name:"面包",category:"小吃",calories:265,protein:8,carbs:49,fat:4,serving:"100g"},
  {id:34,name:"饼干",category:"小吃",calories:484,protein:6,carbs:64,fat:22,serving:"100g"},
  {id:35,name:"可乐",category:"饮品",calories:39,protein:0,carbs:10,fat:0,serving:"100ml"},
  {id:36,name:"奶茶",category:"饮品",calories:68,protein:2,carbs:10,fat:2.5,serving:"100ml"},
  {id:37,name:"咖啡",category:"饮品",calories:2,protein:0.3,carbs:0,fat:0,serving:"100ml"},
  {id:38,name:"牛奶",category:"饮品",calories:61,protein:3.2,carbs:4.8,fat:3.3,serving:"100ml"},
  {id:39,name:"酸奶",category:"饮品",calories:72,protein:2.5,carbs:10,fat:2.7,serving:"100ml"},
  {id:40,name:"苹果",category:"水果",calories:52,protein:0.3,carbs:14,fat:0.2,serving:"100g"},
  {id:41,name:"香蕉",category:"水果",calories:89,protein:1.1,carbs:23,fat:0.3,serving:"100g"},
  {id:42,name:"橙子",category:"水果",calories:47,protein:0.9,carbs:12,fat:0.1,serving:"100g"},
  {id:43,name:"西瓜",category:"水果",calories:30,protein:0.6,carbs:8,fat:0.2,serving:"100g"},
  {id:44,name:"葡萄",category:"水果",calories:69,protein:0.7,carbs:18,fat:0.2,serving:"100g"},
  {id:45,name:"草莓",category:"水果",calories:32,protein:0.7,carbs:8,fat:0.3,serving:"100g"},
  {id:46,name:"西红柿",category:"蔬菜",calories:18,protein:0.9,carbs:3.9,fat:0.2,serving:"100g"},
  {id:47,name:"土豆",category:"蔬菜",calories:77,protein:2,carbs:17,fat:0.1,serving:"100g"},
  {id:48,name:"胡萝卜",category:"蔬菜",calories:41,protein:0.9,carbs:10,fat:0.2,serving:"100g"},
  {id:49,name:"西兰花",category:"蔬菜",calories:34,protein:2.8,carbs:7,fat:0.4,serving:"100g"},
  {id:50,name:"黄瓜",category:"蔬菜",calories:15,protein:0.8,carbs:3,fat:0.2,serving:"100g"},
  {id:51,name:"鸡蛋",category:"蛋类",calories:155,protein:13,carbs:1.1,fat:11,serving:"100g"},
  {id:52,name:"汉堡",category:"快餐",calories:295,protein:13,carbs:30,fat:14,serving:"100g"},
  {id:53,name:"披萨",category:"快餐",calories:266,protein:11,carbs:33,fat:10,serving:"100g"},
  {id:54,name:"薯条",category:"快餐",calories:312,protein:3.4,carbs:41,fat:15,serving:"100g"},
  {id:55,name:"炸鸡",category:"快餐",calories:307,protein:23,carbs:11,fat:19,serving:"100g"},
  {id:56,name:"三明治",category:"快餐",calories:230,protein:9,carbs:26,fat:10,serving:"100g"},
  {id:57,name:"方便面",category:"主食",calories:188,protein:7,carbs:26,fat:7,serving:"100g"},
  {id:58,name:"热干面",category:"主食",calories:172,protein:5,carbs:28,fat:5,serving:"100g"},
  {id:59,name:"凉皮",category:"主食",calories:138,protein:3,carbs:30,fat:1,serving:"100g"},
  {id:60,name:"小笼包",category:"小吃",calories:238,protein:9,carbs:28,fat:10,serving:"100g"},
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('q') || ''
    const kw = keyword.toLowerCase()
    
    let results = foods.filter((f: any) => 
      f.name.toLowerCase().includes(kw)
    )
    
    if (results.length === 0) {
      const chineseName = foodTranslation[kw]
      if (chineseName) {
        results = foods.filter((f: any) => f.name.includes(chineseName))
      }
    }
    
    return NextResponse.json(results.slice(0, 20))
  } catch (error) {
    console.error('Local food API error:', error)
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 })
  }
}
