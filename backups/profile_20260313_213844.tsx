'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Scale, Ruler, Calendar, Target, Calculator, Info, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

type GoalType = 'lose_fat' | 'muscle' | 'maintain'

interface UserProfile {
  weight: number
  height: number
  age: number
  goal: GoalType
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    weight: 70,
    height: 170,
    age: 30,
    goal: 'lose_fat'
  })

  // 计算BMI
  const bmi = user.weight / Math.pow(user.height / 100, 2)
  
  // BMI分类
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: '偏瘦', color: 'text-yellow-500' }
    if (bmi < 24) return { text: '正常', color: 'text-green-500' }
    if (bmi < 28) return { text: '偏胖', color: 'text-orange-500' }
    return { text: '肥胖', color: 'text-red-500' }
  }
  
  const bmiCategory = getBMICategory(bmi)

  // 计算热量
  const calculateCalories = () => {
    const bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    const tdee = Math.round(bmr * 1.4)
    
    const goals: Record<GoalType, { calories: number; desc: string }> = {
      'lose_fat': { calories: tdee - 300, desc: '每天减少300千卡' },
      'muscle': { calories: tdee + 300, desc: '每天增加300千卡' },
      'maintain': { calories: tdee, desc: '维持当前体重' }
    }
    
    return { bmr: Math.round(bmr), tdee, ...goals[user.goal] }
  }
  
  const calorieData = calculateCalories()

  const goalOptions: { value: GoalType; label: string; icon: any; desc: string }[] = [
    { value: 'lose_fat', label: '减脂', icon: <TrendingDown className="w-5 h-5" />, desc: '减少体脂率' },
    { value: 'muscle', label: '增肌', icon: <TrendingUp className="w-5 h-5" />, desc: '增加肌肉量' },
    { value: 'maintain', label: '保持', icon: <Scale className="w-5 h-5" />, desc: '维持现状' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <div className="bg-gradient-to-b from-green-500 to-green-600 text-white p-4 pt-12">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">我的资料</h1>
        </div>
        
        {/* BMI显示 - 居中 */}
        <div className="text-center mb-2">
          <div className="text-6xl font-bold">{bmi.toFixed(1)}</div>
          <div className={`text-lg font-medium ${bmiCategory.color.replace('text-', 'text-green-')}`}>
            {bmiCategory.text}
          </div>
        </div>
        
        {/* BMI进度条 */}
        <div className="mt-4 relative h-2 bg-green-400 rounded-full">
          <div className="absolute left-0 top-0 h-full w-1/4 bg-yellow-400 rounded-l-full"></div>
          <div className="absolute left-1/4 top-0 h-full w-1/4 bg-green-400"></div>
          <div className="absolute left-1/2 top-0 h-full w-1/4 bg-orange-400"></div>
          <div className="absolute left-3/4 top-0 h-full w-1/4 bg-red-400 rounded-r-full"></div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow transform -translate-x-1/2"
            style={{ left: `${Math.min(Math.max(bmi / 35 * 100, 0), 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-green-200 mt-1">
          <span>偏瘦</span>
          <span>正常</span>
          <span>偏胖</span>
          <span>肥胖</span>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* 身体数据 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4 text-center">身体数据</h2>
          
          <div className="space-y-4">
            {/* 体重 */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">体重 (kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setUser({...user, weight: Math.max(30, user.weight - 1)})}
                  className="w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-600"
                >-</button>
                <span className="w-14 text-center font-bold text-lg">{user.weight}</span>
                <button 
                  onClick={() => setUser({...user, weight: user.weight + 1})}
                  className="w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold"
                >+</button>
              </div>
            </div>
            
            {/* 身高 */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">身高 (cm)</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setUser({...user, height: Math.max(100, user.height - 1)})}
                  className="w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-600"
                >-</button>
                <span className="w-14 text-center font-bold text-lg">{user.height}</span>
                <button 
                  onClick={() => setUser({...user, height: user.height + 1})}
                  className="w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold"
                >+</button>
              </div>
            </div>
            
            {/* 年龄 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">年龄 (岁)</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setUser({...user, age: Math.max(10, user.age - 1)})}
                  className="w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-600"
                >-</button>
                <span className="w-14 text-center font-bold text-lg">{user.age}</span>
                <button 
                  onClick={() => setUser({...user, age: user.age + 1})}
                  className="w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold"
                >+</button>
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
                onClick={() => setUser({...user, goal: option.value})}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  user.goal === option.value 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  user.goal === option.value ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {option.icon}
                </div>
                <div className={`font-medium ${user.goal === option.value ? 'text-green-600' : 'text-gray-700'}`}>
                  {option.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 热量建议 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-base font-semibold text-center mb-4">每日热量目标</h2>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold">{calorieData.calories}</div>
            <div className="text-green-100">千卡/天</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center border-t border-green-400 pt-4">
            <div>
              <div className="text-2xl font-bold">{calorieData.bmr}</div>
              <div className="text-xs text-green-200">基础代谢</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{calorieData.tdee}</div>
              <div className="text-xs text-green-200">日常消耗</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{calorieData.calories - calorieData.tdee}</div>
              <div className="text-xs text-green-200">调整</div>
            </div>
          </div>
          
          <div className="mt-4 text-center bg-green-700 rounded-lg py-2 text-sm">
            {calorieData.desc}
          </div>
        </div>

        {/* 说明 */}
        <div className="bg-gray-100 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600 space-y-1">
            <p>• BMR: 身体安静状态下消耗的热量</p>
            <p>• TDEE: 考虑日常活动后的总消耗</p>
            <p>• 建议摄入低于TDEE来减脂</p>
          </div>
        </div>
      </div>
    </div>
  )
}
