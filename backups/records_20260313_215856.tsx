'use client'

import { useState } from 'react'
import { ArrowLeft, TrendingDown, TrendingUp, Minus, Calendar, BarChart3, Circle, User } from 'lucide-react'
import Link from 'next/link'

type ViewType = 'week' | 'month'

// 模拟数据
const weekData = [
  { day: '周一', calories: 1850, target: 2000, weight: 70.2 },
  { day: '周二', calories: 1920, target: 2000, weight: 70.0 },
  { day: '周三', calories: 1750, target: 2000, weight: 69.8 },
  { day: '周四', calories: 2100, target: 2000, weight: 69.5 },
  { day: '周五', calories: 1880, target: 2000, weight: 69.3 },
  { day: '周六', calories: 2200, target: 2000, weight: 69.0 },
  { day: '周日', calories: 1950, target: 2000, weight: 68.8 },
]

const monthData = [
  { week: '第1周', calories: 13350, target: 14000, avgWeight: 70.5 },
  { week: '第2周', calories: 12800, target: 14000, avgWeight: 69.8 },
  { week: '第3周', calories: 13500, target: 14000, avgWeight: 69.2 },
  { week: '第4周', calories: 13100, target: 14000, avgWeight: 68.8 },
]

export default function RecordsPage() {
  const [view, setView] = useState<ViewType>('week')
  const data = view === 'week' ? weekData : monthData

  const avgCalories = data.reduce((sum, d) => sum + d.calories, 0) / data.length
  const totalWeightLoss = weekData[0].weight - weekData[6].weight
  const complianceRate = data.filter(d => d.calories <= d.target).length / data.length * 100

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-b from-green-500 to-green-600 text-white p-4 pt-12">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </Link>
        <h1 className="text-2xl font-bold text-center">饮食记录</h1>
        
        {/* 切换按钮 */}
        <div className="flex justify-center mt-4">
          <div className="bg-white/20 rounded-full p-1 flex">
            <button
              onClick={() => setView('week')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'week' ? 'bg-white text-green-600' : 'text-white/80'
              }`}
            >
              周
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'month' ? 'bg-white text-green-600' : 'text-white/80'
              }`}
            >
              月
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="p-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(avgCalories)}</div>
            <div className="text-xs text-gray-500">平均千卡</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className={`text-2xl font-bold ${totalWeightLoss > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {totalWeightLoss > 0 ? '-' : '+'}{Math.abs(totalWeightLoss).toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">{view === 'week' ? '本周变化(kg)' : '月变化(kg)'}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(complianceRate)}%</div>
            <div className="text-xs text-gray-500">达标率</div>
          </div>
        </div>
      </div>

      {/* 图表 */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">摄入趋势</h3>
          
          {/* 简易柱状图 */}
          <div className="flex items-end justify-between gap-2 h-40">
            {data.map((d, i) => {
              const height = (d.calories / 2500) * 100
              const isOver = d.calories > d.target
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-t-lg ${isOver ? 'bg-red-400' : 'bg-green-500'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{d.day || d.week}</span>
                </div>
              )
            })}
          </div>
          
          {/* 目标线 */}
          <div className="relative h-0 border-t-2 border-dashed border-gray-300 mt-2" style={{ top: '-160px' }}>
            <span className="absolute right-0 -top-3 text-xs text-gray-400">目标</span>
          </div>
        </div>
      </div>

      {/* 详细数据 */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  {view === 'week' ? '日期' : '周'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">摄入</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">目标</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((d, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm text-gray-800">{d.day || d.week}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{d.calories}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-400">{d.target}</td>
                  <td className="px-4 py-3 text-right">
                    {d.calories <= d.target ? (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <Minus className="w-3 h-3 mr-1" />达标
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-500 text-sm">
                        <TrendingUp className="w-3 h-3 mr-1" />超标
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center text-gray-400">
          <Circle className="w-6 h-6" />
          <span className="text-xs mt-1">记录</span>
        </Link>
        <Link href="/records" className="flex flex-col items-center text-green-600">
          <BarChart3 className="w-6 h-6" />
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
