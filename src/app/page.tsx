'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, Circle, Calendar, BarChart3, User, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id?: string
  weight: number
  height: number
  age: number
  goal: 'lose_fat' | 'muscle' | 'maintain'
  targetCalories?: number
}

const defaultUser: UserProfile = {
  weight: 70,
  height: 170,
  age: 30,
  goal: 'lose_fat',
  targetCalories: 2000
}

interface FoodRecord {
  id: string
  name: string
  calories: number
  carbs: number
  protein: number
  fat: number
  time: string
  date?: string
}

interface SearchFood {
  id: string
  name: string
  brand?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
}

export default function Home() {
  const [user, setUser] = useState<UserProfile>(defaultUser)
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [caloriesConsumed, setCaloriesConsumed] = useState(0)
  const [showNav, setShowNav] = useState(true)
  const [showAddFood, setShowAddFood] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<SearchFood[]>([])
  const [selectedFood, setSelectedFood] = useState<SearchFood | null>(null)
  const [servingAmount, setServingAmount] = useState(1)
  const lastScrollY = useRef(0)

  // 获取用户数据
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.id) setUser(data)
      })
      .catch(console.error)
  }, [])

  // 获取今日饮食记录
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    fetch(`/api/records?date=${today}`)
      .then(res => res.json())
      .then(data => {
        setRecords(data)
        const total = data.reduce((sum: number, r: FoodRecord) => sum + (r.calories || 0), 0)
        setCaloriesConsumed(total)
      })
      .catch(console.error)
  }, [])

  // 搜索食物（优先本地数据库）
  const searchFoods = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([])
      return
    }
    try {
      // 优先搜索本地中餐数据库
      const localRes = await fetch(`/api/foods/local?q=${encodeURIComponent(keyword)}`)
      const localData = await localRes.json()
      
      if (localData.length > 0) {
        // 转换格式
        setSearchResults(localData.map((f: any) => ({
          id: f.id,
          name: f.name,
          brand: f.category,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fat: f.fat,
          servingSize: f.serving,
          source: 'local'
        })))
      } else {
        // 本地没有再搜索OpenFoodFacts
        const res = await fetch(`/api/foods?q=${encodeURIComponent(keyword)}&limit=10`)
        const data = await res.json()
        setSearchResults(data.map((f: any) => ({...f, source: 'online'})))
      }
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  // 添加食物记录
  const addFoodRecord = async () => {
    if (!selectedFood) return
    
    const now = new Date()
    const record: Partial<FoodRecord> = {
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * servingAmount),
      protein: Math.round(selectedFood.protein * servingAmount),
      carbs: Math.round(selectedFood.carbs * servingAmount),
      fat: Math.round(selectedFood.fat * servingAmount),
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      date: now.toISOString().split('T')[0]
    }

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      })
      const newRecord = await res.json()
      setRecords([newRecord, ...records])
      setCaloriesConsumed(prev => prev + newRecord.calories)
      setShowAddFood(false)
      setSelectedFood(null)
      setSearchKeyword('')
      setSearchResults([])
    } catch (error) {
      console.error('Failed to add record:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowNav(false)
      } else {
        setShowNav(true)
      }
      lastScrollY.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const calculateCalories = () => {
    const bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    const tdee = bmr * 1.4
    
    let targetCalories = user.targetCalories || tdee
    switch (user.goal) {
      case 'lose_fat': targetCalories = tdee - 300; break
      case 'muscle': targetCalories = tdee + 300; break
      case 'maintain': targetCalories = tdee; break
    }
    
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(targetCalories) }
  }
  
  const caloriesData = calculateCalories()
  const caloriesRemaining = caloriesData.target - caloriesConsumed
  const progressPercent = Math.min((caloriesConsumed / caloriesData.target) * 100, 100)
  
  const goalText: Record<string, string> = { 'lose_fat': '减脂', 'muscle': '增肌', 'maintain': '保持' }
  const goalBgColor: Record<string, string> = { 'lose_fat': 'bg-emerald-500', 'muscle': 'bg-blue-500', 'maintain': 'bg-gray-400' }

  const circleRadius = 70
  const circumference = 2 * Math.PI * circleRadius

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 添加食物弹窗 */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">添加食物</h3>
              <button onClick={() => setShowAddFood(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="搜索食物..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value)
                searchFoods(e.target.value)
              }}
              className="w-full p-3 border rounded-xl mb-4"
              autoFocus
            />
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(food => (
                <div
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`p-3 border rounded-xl cursor-pointer ${selectedFood?.id === food.id ? 'border-emerald-500 bg-emerald-50' : ''}`}
                >
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-500">
                    {food.calories} kcal / {food.servingSize}
                    {food.brand && ` · ${food.brand}`}
                  </div>
                </div>
              ))}
              {searchKeyword && searchResults.length === 0 && (
                <p className="text-center text-gray-500 py-4">未找到相关食物</p>
              )}
            </div>

            {selectedFood && (
              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-2">
                  份量: {servingAmount} 份 ({selectedFood.servingSize} 每份)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={servingAmount}
                  onChange={(e) => setServingAmount(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2">
                  热量: <span className="font-bold text-emerald-600">{Math.round(selectedFood.calories * servingAmount)} kcal</span>
                </div>
                <button
                  onClick={addFoodRecord}
                  className="w-full mt-4 bg-emerald-500 text-white py-3 rounded-xl font-medium"
                >
                  添加
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 顶部 */}
      <div className="bg-gradient-to-b from-emerald-400 to-emerald-100 text-gray-800 px-4 pt-12 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">今日摄入</p>
            <h1 className="text-4xl font-bold">{caloriesConsumed}</h1>
            <p className="text-sm opacity-80">目标 {caloriesData.target} kcal</p>
          </div>
          
          {/* 卡路里进度环 */}
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progressPercent / 100) * circumference}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
              <span className="text-xs opacity-80">剩余 {caloriesRemaining} kcal</span>
            </div>
          </div>
        </div>
        
        {/* 目标标签 */}
        <div className={`inline-block px-3 py-1 rounded-full text-white text-sm mt-4 ${goalBgColor[user.goal]}`}>
          {goalText[user.goal]} · 基础代谢 {caloriesData.bmr} kcal
        </div>
      </div>

      {/* 今日记录 */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">今日饮食</h2>
          <button 
            onClick={() => setShowAddFood(true)}
            className="flex items-center gap-1 text-emerald-600 text-sm"
          >
            <Plus className="w-4 h-4" /> 添加
          </button>
        </div>
        
        {records.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>暂无饮食记录</p>
            <p className="text-sm">点击上方"添加"记录饮食</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map(record => (
              <div key={record.id} className="bg-white p-3 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-medium">{record.name}</div>
                  <div className="text-xs text-gray-500">
                    {record.protein}蛋白 · {record.carbs}碳水 · {record.fat}脂肪
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{record.calories} kcal</div>
                  <div className="text-xs text-gray-400">{record.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 拍照识别按钮 */}
      <div className="px-4 py-6 flex justify-center">
        <Link href="/camera" className="cursor-pointer">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">拍照识别</p>
        </Link>
      </div>

      {/* 底部导航 */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex justify-around items-center text-xs">
          <Link href="/" className="flex flex-col items-center text-emerald-500">
            <Circle className="w-6 h-6 mb-1" fill="currentColor" />
            首页
          </Link>
          <Link href="/records" className="flex flex-col items-center text-gray-400">
            <BarChart3 className="w-6 h-6 mb-1" />
            记录
          </Link>
          <Link href="/settings" className="flex flex-col items-center text-gray-400">
            <User className="w-6 h-6 mb-1" />
            设置
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-400">
            <User className="w-6 h-6 mb-1" />
            我的
          </Link>
        </nav>
      )}
    </div>
  )
}
