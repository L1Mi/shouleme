'use client'

import { useState, useEffect, useRef } from 'react'
import { Scale, Ruler, Calendar, TrendingUp, TrendingDown, Circle, BarChart3, User } from 'lucide-react'
import Link from 'next/link'

type GoalType = 'lose_fat' | 'muscle' | 'maintain'
type GenderType = 'male' | 'female'

interface UserProfile {
  gender: GenderType
  weight: number
  height: number
  age: number
  goal: GoalType
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    gender: 'male',
    weight: 70,
    height: 170,
    age: 30,
    goal: 'lose_fat'
  })

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

  // BMI计算 - 根据性别调整
  const bmi = user.weight / Math.pow(user.height / 100, 2)

  const getBMICategory = (bmi: number, gender: GenderType) => {
    // 男性和女性的BMI标准略有不同
    if (gender === 'male') {
      if (bmi < 18.5) return { text: '偏瘦', color: 'text-yellow-500', bg: 'bg-yellow-100' }
      if (bmi < 24) return { text: '正常', color: 'text-emerald-500', bg: 'bg-emerald-100' }
      if (bmi < 28) return { text: '偏胖', color: 'text-orange-500', bg: 'bg-orange-100' }
      return { text: '肥胖', color: 'text-red-500', bg: 'bg-red-100' }
    } else {
      if (bmi < 18.5) return { text: '偏瘦', color: 'text-yellow-500', bg: 'bg-yellow-100' }
      if (bmi < 24) return { text: '正常', color: 'text-emerald-500', bg: 'bg-emerald-100' }
      if (bmi < 28) return { text: '偏胖', color: 'text-orange-500', bg: 'bg-orange-100' }
      return { text: '肥胖', color: 'text-red-500', bg: 'bg-red-100' }
    }
  }

  const bmiCategory = getBMICategory(bmi, user.gender)

  // 热量计算 - 根据性别调整
  const calculateCalories = () => {
    let bmr: number
    if (user.gender === 'male') {
      // 男性: BMR = 10×体重(kg) + 6.25×身高(cm) - 5×年龄 + 5
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    } else {
      // 女性: BMR = 10×体重(kg) + 6.25×身高(cm) - 5×年龄 - 161
      bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161
    }
    const tdee = Math.round(bmr * 1.4)

    const goals: Record<GoalType, { calories: number; desc: string }> = {
      'lose_fat': { calories: tdee - 300, desc: '每天减少300千卡' },
      'muscle': { calories: tdee + 300, desc: '每天增加300千卡' },
      'maintain': { calories: tdee, desc: '维持当前体重' }
    }

    return { bmr: Math.round(bmr), tdee, ...goals[user.goal] }
  }

  const calorieData = calculateCalories()

  const goalOptions = [
    { value: 'lose_fat' as GoalType, label: '减脂', icon: <TrendingDown className="w-5 h-5" />, desc: '减少体脂率' },
    { value: 'muscle' as GoalType, label: '增肌', icon: <TrendingUp className="w-5 h-5" />, desc: '增加肌肉量' },
    { value: 'maintain' as GoalType, label: '保持', icon: <Scale className="w-5 h-5" />, desc: '维持现状' },
  ]

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    const numValue = parseFloat(value) || 0
    setUser({ ...user, [field]: numValue })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-b from-emerald-400 to-emerald-100 text-gray-800 px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-center">我的资料</h1>

        <div className="text-center mb-4">
          <div className="text-7xl font-bold">{bmi.toFixed(1)}</div>
          <div className={`inline-block mt-2 px-4 py-1 rounded-full text-lg font-medium ${bmiCategory.bg} ${bmiCategory.color}`}>
            {bmiCategory.text}
          </div>
        </div>

        <div className="mt-4 relative h-2 bg-gray-200 rounded-full">
          <div className="absolute left-0 top-0 h-full w-1/4 bg-yellow-400 rounded-l-full"></div>
          <div className="absolute left-1/4 top-0 h-full w-1/4 bg-emerald-400"></div>
          <div className="absolute left-1/2 top-0 h-full w-1/4 bg-orange-400"></div>
          <div className="absolute left-3/4 top-0 h-full w-1/4 bg-red-400 rounded-r-full"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>偏瘦</span>
          <span>正常</span>
          <span>偏胖</span>
          <span>肥胖</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 性别选择 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 text-center">性别</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setUser({ ...user, gender: 'male' })}
              className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                user.gender === 'male' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-600'
              }`}
            >
              男性
            </button>
            <button
              onClick={() => setUser({ ...user, gender: 'female' })}
              className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                user.gender === 'female' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-600'
              }`}
            >
              女性
            </button>
          </div>
        </div>

        {/* 身体数据 - 可输入 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 text-center">身体数据</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Scale className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-gray-700 font-medium">体重</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={user.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                />
                <span className="text-gray-400">kg</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">身高</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={user.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                />
                <span className="text-gray-400">cm</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">年龄</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={user.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                />
                <span className="text-gray-400">岁</span>
              </div>
            </div>
          </div>
        </div>

        {/* 目标选择 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 text-center">选择目标</h2>
          <div className="grid grid-cols-3 gap-3">
            {goalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setUser({ ...user, goal: option.value })}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${user.goal === option.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'}`}
              >
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${user.goal === option.value ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {option.icon}
                </div>
                <div className={`font-medium ${user.goal === option.value ? 'text-emerald-600' : 'text-gray-700'}`}>{option.label}</div>
                <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 热量建议 */}
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-base font-semibold text-center mb-4">每日热量目标</h2>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold">{calorieData.calories}</div>
            <div className="text-emerald-100">千卡/天</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center border-t border-emerald-400 pt-4">
            <div>
              <div className="text-2xl font-bold">{calorieData.bmr}</div>
              <div className="text-xs text-emerald-200">基础代谢</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{calorieData.tdee}</div>
              <div className="text-xs text-emerald-200">日常消耗</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{calorieData.calories - calorieData.tdee}</div>
              <div className="text-xs text-emerald-200">调整</div>
            </div>
          </div>
          <div className="mt-4 text-center bg-emerald-700 rounded-xl py-3 text-sm font-medium">{calorieData.desc}</div>
        </div>
      </div>

      {/* 底部导航 */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center transition-transform duration-300 shadow-lg ${showNav ? 'translate-y-0' : 'translate-y-full'}`}>
        <Link href="/" className="flex flex-col items-center text-gray-400">
          <Circle className="w-6 h-6" />
          <span className="text-xs mt-1">记录</span>
        </Link>
        <Link href="/records" className="flex flex-col items-center text-gray-400">
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs mt-1">周/月</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-emerald-600">
          <User className="w-6 h-6" fill="currentColor" />
          <span className="text-xs mt-1 font-medium">我的</span>
        </Link>
      </div>
    </div>
  )
}
