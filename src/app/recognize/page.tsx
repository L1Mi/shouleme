'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Camera, ArrowLeft, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface RecognizedFood {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sodium: number
  probability: number
}

interface SearchFood {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
}

function RecognizeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [recognizedFoods, setRecognizedFoods] = useState<RecognizedFood[]>([])
  const [matchedFood, setMatchedFood] = useState<SearchFood | null>(null)
  const [servingAmount, setServingAmount] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)

  useEffect(() => {
    const base64 = searchParams.get('image')
    if (base64) {
      recognizeFood(base64)
    }
  }, [searchParams])

  const recognizeFood = async (base64: string) => {
    try {
      setIsLoading(true)
      setError('')
      
      const res = await fetch(`/api/foods/baidu?base64=${encodeURIComponent(base64)}`)
      const data = await res.json()
      
      if (data.needConfig) {
        setError('请先在Vercel后台配置百度API Key')
        setIsLoading(false)
        return
      }
      
      if (data.error) {
        setError(data.error || '识别失败')
        setIsLoading(false)
        return
      }
      
      // 获取识别结果
      const foods = data.result || []
      setRecognizedFoods(foods.map((f: any) => ({
        name: f.name,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 0,
        probability: f.probability || 0
      })))
      
      // 尝试匹配本地数据库
      if (foods.length > 0) {
        const topFood = foods[0].name
        await searchLocalDatabase(topFood)
      }
    } catch (err) {
      console.error('识别失败:', err)
      setError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const searchLocalDatabase = async (keyword: string) => {
    try {
      const res = await fetch(`/api/foods/local?q=${encodeURIComponent(keyword)}`)
      const data = await res.json()
      if (data.length > 0) {
        setMatchedFood(data[0])
      }
    } catch (error) {
      console.error('搜索失败:', error)
    }
  }

  const addFoodRecord = async () => {
    if (!matchedFood) return
    
    setIsAdding(true)
    try {
      const now = new Date()
      const record = {
        name: matchedFood.name,
        calories: Math.round(matchedFood.calories * servingAmount),
        protein: Math.round(matchedFood.protein * servingAmount),
        carbs: Math.round(matchedFood.carbs * servingAmount),
        fat: Math.round(matchedFood.fat * servingAmount),
        time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        date: now.toISOString().split('T')[0]
      }
      
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      })
      
      if (res.ok) {
        setAddedSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 1500)
      }
    } catch (error) {
      console.error('添加失败:', error)
      alert('添加失败')
    }
    setIsAdding(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在识别食物...</p>
        </div>
      </div>
    )
  }

  if (addedSuccess) {
    return (
      <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <p className="text-xl font-bold">添加成功！</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-b from-red-400 to-red-100 px-4 pt-12 pb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-800">
            <ArrowLeft className="w-6 h-6" />
            <span>返回</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">识别失败</h1>
        </div>
        <div className="px-4 py-6">
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/" className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-xl">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <div className="bg-gradient-to-b from-emerald-400 to-emerald-100 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-gray-800">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">识别结果</h1>
        </div>
        
        {/* 识别到的食物列表 */}
        {recognizedFoods.length > 0 && (
          <div className="bg-white/30 rounded-xl p-3">
            <p className="text-sm text-gray-600 mb-2">AI 识别：</p>
            <div className="flex flex-wrap gap-2">
              {recognizedFoods.slice(0, 3).map((food, i) => (
                <span 
                  key={i} 
                  className={`px-3 py-1 rounded-full text-sm ${i === 0 ? 'bg-white text-emerald-600 font-bold' : 'bg-white/50 text-gray-600'}`}
                >
                  {food.name} {Math.round(food.probability * 100)}%
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 匹配结果 */}
      <div className="px-4 py-4">
        {matchedFood ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-lg mb-4">{matchedFood.name}</h2>
            <p className="text-sm text-gray-500 mb-4">每 {matchedFood.servingSize}</p>
            
            {/* 6大核心营养成分 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">{matchedFood.calories}</div>
                <div className="text-xs text-gray-500">热量(kcal)</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{matchedFood.protein}g</div>
                <div className="text-xs text-gray-500">蛋白质</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">{matchedFood.carbs}g</div>
                <div className="text-xs text-gray-500">碳水</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-500">{matchedFood.fat}g</div>
                <div className="text-xs text-gray-500">脂肪</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{Math.round(matchedFood.calories * 0.05)}g</div>
                <div className="text-xs text-gray-500">膳食纤维</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{Math.round(matchedFood.calories * 0.02)}mg</div>
                <div className="text-xs text-gray-500">钠</div>
              </div>
            </div>

            {/* 份量选择 */}
            <div className="mb-4">
              <label className="text-sm text-gray-500 mb-2 block">份量：{servingAmount} 份</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={servingAmount}
                onChange={(e) => setServingAmount(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 总热量 */}
            <div className="bg-gray-100 rounded-xl p-3 mb-4 text-center">
              <span className="text-gray-500">总计：</span>
              <span className="text-xl font-bold text-emerald-600">
                {Math.round(matchedFood.calories * servingAmount)} kcal
              </span>
            </div>

            {/* 添加按钮 */}
            <button
              onClick={addFoodRecord}
              disabled={isAdding}
              className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {isAdding ? '添加中...' : (
                <>
                  <Check className="w-5 h-5" /> 添加到今日饮食
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-gray-500 mb-4">未能识别出食物，请重试</p>
            <Link href="/" className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-xl">
              返回首页
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RecognizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
      </div>
    }>
      <RecognizeContent />
    </Suspense>
  )
}
