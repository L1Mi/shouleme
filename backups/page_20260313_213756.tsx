'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, Circle, Calendar, BarChart3, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  weight: number
  height: number
  age: number
  goal: 'lose_fat' | 'muscle' | 'maintain'
}

const defaultUser: UserProfile = {
  weight: 70,
  height: 170,
  age: 30,
  goal: 'lose_fat'
}

interface FoodRecord {
  id: string
  name: string
  calories: number
  carbs: number
  protein: number
  fat: number
  time: string
}

const mockRecords: FoodRecord[] = [
  { id: '1', name: '豆浆+油条', calories: 450, carbs: 45, protein: 12, fat: 20, time: '08:30' },
  { id: '2', name: '红烧肉+米饭', calories: 680, carbs: 60, protein: 25, fat: 35, time: '12:30' },
]

export default function Home() {
  const [user, setUser] = useState<UserProfile>(defaultUser)
  const [records, setRecords] = useState<FoodRecord[]>(mockRecords)
  const [caloriesConsumed, setCaloriesConsumed] = useState(1130)
  const [showNav, setShowNav] = useState(true)
  const lastScrollY = useRef(0)
  
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
    
    let targetCalories = tdee
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
  
  const goalText = { 'lose_fat': '减脂', 'muscle': '增肌', 'maintain': '保持' }
  const goalBgColor = { 'lose_fat': 'bg-green-500', 'muscle': 'bg-blue-500', 'maintain': 'bg-gray-400' }

  const goalColor = { 'lose_fat': 'text-green-500', 'muscle': 'text-blue-500', 'maintain': 'text-gray-500' }

  const circleRadius = 70
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-b from-green-500 to-green-600 text-white px-4 pt-12 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <h1 className="text-xl font-bold">瘦了吗</h1>
          <Link href="/profile" className="p-2 bg-white/20 rounded-full">
            <User className="w-5 h-5" />
          </Link>
        </div>
        
        {/* 目标标签 */}
        <div className="text-center mb-4">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${goalBgColor[user.goal]} text-white`}>
            {goalText[user.goal]}
          </span>
        </div>
        
        {/* 卡路里圆圈 */}
        <div className="flex justify-center mb-4">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r={circleRadius} stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="none" />
              <circle
                cx="88" cy="88" r={circleRadius}
                stroke="white" strokeWidth="10" fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{caloriesConsumed}</div>
              <div className="text-green-200 text-xs">/ {caloriesData.target} 千卡</div>
            </div>
          </div>
        </div>
        
        {/* 统计 */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{caloriesRemaining > 0 ? caloriesRemaining : 0}</div>
            <div className="text-green-200 text-xs">剩余</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.weight}</div>
            <div className="text-green-200 text-xs">kg</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{caloriesData.target}</div>
            <div className="text-green-200 text-xs">目标</div>
          </div>
        </div>
      </div>

      {/* 拍照按钮 */}
      <div className="px-4 -mt-6">
        <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95">
          <Camera className="w-6 h-6" />
          <span className="text-lg font-medium">拍照识别食物</span>
        </button>
      </div>

      {/* 今日饮食 */}
      <div className="p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">今日饮食</h2>
          <span className="text-sm text-gray-400">{records.length}条</span>
        </div>
        
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-800">{record.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{record.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 text-lg">{record.calories}</div>
                  <div className="text-xs text-gray-400">千卡</div>
                </div>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                <span>碳水 {record.carbs}g</span>
                <span>蛋白 {record.protein}g</span>
                <span>脂肪 {record.fat}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部导航 - 滚动隐藏 */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center transition-transform duration-300 ${
          showNav ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Link href="/" className="flex flex-col items-center text-green-600">
          <Circle className="w-6 h-6" fill="currentColor" />
          <span className="text-xs mt-1 font-medium">记录</span>
        </Link>
        <Link href="/records" className="flex flex-col items-center text-gray-400">
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">周/月</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-400">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">我的</span>
        </Link>
      </div>
    </div>
  )
}
