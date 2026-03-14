'use client'

import { useState, useEffect, useRef } from 'react'
import { Scale, Ruler, Calendar, TrendingUp, TrendingDown, Circle, BarChart3, User, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type GoalType = 'lose_fat' | 'muscle' | 'maintain'
type GenderType = 'male' | 'female'

interface UserProfile {
  id?: string
  gender: GenderType
  weight: number
  height: number
  age: number
  goal: GoalType
  targetCalories?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile>({
    gender: 'male',
    weight: 70,
    height: 170,
    age: 30,
    goal: 'lose_fat'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
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

  // 保存用户数据
  const saveUser = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      if (res.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to save:', error)
    }
    setIsSaving(false)
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

  // BMI计算
  const bmi = user.weight / Math.pow(user.height / 100, 2)

  const getBMICategory = (bmi: number, gender: GenderType) => {
    if (gender === 'male') {
      if (bmi < 18.5) return { text: '偏瘦', color: 'text-yellow-500' }
      if (bmi < 24) return { text: '正常', color: 'text-green-500' }
      if (bmi < 28) return { text: '偏胖', color: 'text-orange-500' }
      return { text: '肥胖', color: 'text-red-500' }
    } else {
      if (bmi < 18.5) return { text: '偏瘦', color: 'text-yellow-500' }
      if (bmi < 24) return { text: '正常', color: 'text-green-500' }
      if (bmi < 28) return { text: '偏胖', color: 'text-orange-500' }
      return { text: '肥胖', color: 'text-red-500' }
    }
  }

  const bmiCategory = getBMICategory(bmi, user.gender)

  // 计算基础代谢率和TDEE
  const bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + (user.gender === 'male' ? 5 : -161)
  const tdee = bmr * 1.4

  const goalCalories: Record<GoalType, number> = {
    'lose_fat': Math.round(tdee - 300),
    'muscle': Math.round(tdee + 300),
    'maintain': Math.round(tdee)
  }

  const goalLabels: Record<GoalType, { text: string; desc: string }> = {
    'lose_fat': { text: '减脂', desc: '每日减少300kcal' },
    'muscle': { text: '增肌', desc: '每日增加300kcal' },
    'maintain': { text: '保持', desc: '维持当前体重' }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-b from-blue-400 to-blue-100 text-gray-800 px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-center">个人资料</h1>
        
        {/* 头像 */}
        <div className="flex justify-center mt-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-blue-400" />
          </div>
        </div>
      </div>

      {/* BMI卡片 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{bmi.toFixed(1)}</div>
              <div className={`text-sm ${bmiCategory.color}`}>{bmiCategory.text}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(bmr)}</div>
              <div className="text-sm text-gray-500">基础代谢</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(tdee)}</div>
              <div className="text-sm text-gray-500">日常消耗</div>
            </div>
          </div>
        </div>
      </div>

      {/* 表单 */}
      <div className="px-4 py-4 space-y-4">
        {/* 性别 */}
        <div className="bg-white rounded-xl p-4">
          <label className="text-sm text-gray-500 mb-2 block">性别</label>
          <div className="flex gap-4">
            <button
              onClick={() => setUser({ ...user, gender: 'male' })}
              className={`flex-1 py-2 rounded-lg border-2 ${user.gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-200'}`}
            >
              男
            </button>
            <button
              onClick={() => setUser({ ...user, gender: 'female' })}
              className={`flex-1 py-2 rounded-lg border-2 ${user.gender === 'female' ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-200'}`}
            >
              女
            </button>
          </div>
        </div>

        {/* 体重 */}
        <div className="bg-white rounded-xl p-4 text-center">
          <label className="text-sm text-gray-500 mb-2 block text-center">
            <Scale className="w-4 h-4 inline mr-1" /> 体重 (kg)
          </label>
          <input
            type="number"
            value={user.weight || ''}
            onChange={(e) => setUser({ ...user, weight: parseFloat(e.target.value) || 0 })}
            className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none py-2 text-center"
            placeholder="70"
          />
        </div>

        {/* 身高 */}
        <div className="bg-white rounded-xl p-4 text-center">
          <label className="text-sm text-gray-500 mb-2 block text-center">
            <Ruler className="w-4 h-4 inline mr-1" /> 身高 (cm)
          </label>
          <input
            type="number"
            value={user.height || ''}
            onChange={(e) => setUser({ ...user, height: parseFloat(e.target.value) || 0 })}
            className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none py-2 text-center"
            placeholder="170"
          />
        </div>

        {/* 年龄 */}
        <div className="bg-white rounded-xl p-4 text-center">
          <label className="text-sm text-gray-500 mb-2 block text-center">
            <Calendar className="w-4 h-4 inline mr-1" /> 年龄 (岁)
          </label>
          <input
            type="number"
            value={user.age || ''}
            onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) || 0 })}
            className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none py-2 text-center"
            placeholder="30"
          />
        </div>

        {/* 目标 */}
        <div className="bg-white rounded-xl p-4">
          <label className="text-sm text-gray-500 mb-2">健身目标</label>
          <div className="grid grid-cols-3 gap-2">
            {(['lose_fat', 'muscle', 'maintain'] as GoalType[]).map(goal => (
              <button
                key={goal}
                onClick={() => setUser({ ...user, goal })}
                className={`py-3 rounded-lg border-2 text-center ${user.goal === goal ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="font-medium">{goalLabels[goal].text}</div>
                <div className="text-xs text-gray-500">{goalCalories[goal]} kcal</div>
              </button>
            ))}
          </div>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={saveUser}
          disabled={isSaving}
          className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? '保存中...' : '保存'}
        </button>

        {/* 版本信息 */}
        <div className="text-center text-gray-400 text-sm py-4">
          瘦了吗 v0.01.0
        </div>
      </div>

      {/* 底部导航 */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex justify-around items-center text-xs">
          <Link href="/" className="flex flex-col items-center text-gray-400">
            <Circle className="w-6 h-6 mb-1" />
            首页
          </Link>
          <Link href="/records" className="flex flex-col items-center text-gray-400">
            <BarChart3 className="w-6 h-6 mb-1" />
            记录
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-blue-500">
            <User className="w-6 h-6 mb-1" fill="currentColor" />
            我的
          </Link>
        </nav>
      )}
    </div>
  )
}
