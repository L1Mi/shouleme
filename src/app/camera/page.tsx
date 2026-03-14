'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, ArrowLeft, Upload } from 'lucide-react'

export default function CameraPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsLoading(true)
    
    // 转换为base64
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      // 跳转到识别页面
      router.push(`/recognize?image=${encodeURIComponent(base64)}`)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 顶部 */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <button 
          onClick={() => router.back()}
          className="text-white p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* 相机区域 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* 拍照按钮 */}
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors">
              <Camera className="w-16 h-16 text-white" />
            </div>
          </label>
          
          <p className="text-white mt-6 text-lg">点击拍照</p>
          <p className="text-gray-400 text-sm mt-2">或从相册选择</p>
        </div>
      </div>

      {/* 从相册选择 */}
      <div className="p-6">
        <label className="flex items-center justify-center gap-2 text-gray-400 cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>从相册选择</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* 加载遮罩 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>正在处理...</p>
          </div>
        </div>
      )}
    </div>
  )
}
