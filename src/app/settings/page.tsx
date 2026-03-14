'use client'

import { useState, useEffect } from 'react'
import { Save, Key, Circle, BarChart3, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  // 加载当前配置
  useEffect(() => {
    fetch('/api/foods/baidu')
      .then(res => res.json())
      .then(data => {
        if (data.needConfig) {
          setMessage('请先配置百度API Key')
        }
      })
      .catch(() => {})
  }, [])

  // 保存配置
  const saveConfig = async () => {
    if (!apiKey || !secretKey) {
      setMessage('请填写完整的API Key和Secret Key')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/foods/baidu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, secretKey })
      })
      
      if (res.ok) {
        setMessage('保存成功！')
      } else {
        setMessage('保存失败')
      }
    } catch (error) {
      setMessage('保存失败')
    }
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-b from-purple-400 to-purple-100 text-gray-800 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">设置</h1>
        </div>
        <p className="text-sm opacity-80">配置百度食物识别API</p>
      </div>

      {/* 说明 */}
      <div className="px-4 py-4">
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <h3 className="font-bold text-blue-600 mb-2">如何获取百度API？</h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. 访问 https://console.bai.com/</li>
            <li>2. 创建应用，获取 API Key 和 Secret Key</li>
            <li>3. 开通"食物识别"能力</li>
          </ol>
        </div>

        {/* API配置表单 */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              <Key className="w-4 h-4 inline mr-1" /> API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 border rounded-xl text-center"
              placeholder="请输入API Key"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              <Key className="w-4 h-4 inline mr-1" /> Secret Key
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full p-3 border rounded-xl text-center"
              placeholder="请输入Secret Key"
            />
          </div>

          {message && (
            <p className={`text-center ${message.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <button
            onClick={saveConfig}
            disabled={isSaving}
            className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? '保存中...' : '保存配置'}
          </button>
        </div>

        {/* 版本信息 */}
        <div className="text-center text-gray-400 text-sm py-6">
          瘦了吗 v0.01.0
        </div>
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex justify-around items-center text-xs">
        <Link href="/" className="flex flex-col items-center text-gray-400">
          <Circle className="w-6 h-6 mb-1" />
          首页
        </Link>
        <Link href="/records" className="flex flex-col items-center text-gray-400">
          <BarChart3 className="w-6 h-6 mb-1" />
          记录
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-400">
          <User className="w-6 h-6 mb-1" />
          我的
        </Link>
      </nav>
    </div>
  )
}
