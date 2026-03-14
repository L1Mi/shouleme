import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const configFile = path.join(process.cwd(), 'data', 'baidu_config.json')

// 读取百度API配置 - 优先环境变量
function getBaiduConfig() {
  // Vercel 环境变量优先
  const envApiKey = process.env.BAIDU_API_KEY
  const envSecretKey = process.env.BAIDU_SECRET_KEY
  
  if (envApiKey && envSecretKey) {
    return { apiKey: envApiKey, secretKey: envSecretKey }
  }
  
  // 其次读取本地文件
  try {
    if (fs.existsSync(configFile)) {
      return JSON.parse(fs.readFileSync(configFile, 'utf-8'))
    }
  } catch (e) {}
  return { apiKey: '', secretKey: '' }
}

// 保存百度API配置（仅本地有效）
export async function POST(request: Request) {
  // Vercel 上不允许写文件，直接返回成功
  if (process.env.VERCEL) {
    return NextResponse.json({ 
      error: 'Vercel部署版本不支持修改配置，请通过Vercel后台环境变量设置',
      isVercel: true
    }, { status: 400 })
  }
  
  try {
    const body = await request.json()
    const { apiKey, secretKey } = body
    
    const config = { apiKey, secretKey }
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}

// 获取配置状态
export async function PUT() {
  const config = getBaiduConfig()
  const hasConfig = !!(config.apiKey && config.secretKey)
  const isVercel = !!process.env.VERCEL
  
  return NextResponse.json({ 
    hasConfig,
    isVercel,
    source: process.env.BAIDU_API_KEY ? 'env' : 'local'
  })
}

// 百度食物识别API
export async function GET(request: Request) {
  try {
    const config = getBaiduConfig()
    
    if (!config.apiKey || !config.secretKey) {
      const isVercel = !!process.env.VERCEL
      return NextResponse.json({ 
        error: isVercel ? '请在Vercel后台配置百度API Key' : '请先配置百度API Key',
        needConfig: true,
        isVercel
      }, { status: 400 })
    }
    
    const { searchParams } = new URL(request.url)
    const imageBase64 = searchParams.get('base64')
    
    if (!imageBase64) {
      return NextResponse.json({ error: '缺少图片参数' }, { status: 400 })
    }
    
    // 获取access_token
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.apiKey}&client_secret=${config.secretKey}`
    
    const tokenRes = await fetch(tokenUrl, { method: 'POST' })
    const tokenData = await tokenRes.json()
    
    if (tokenData.error) {
      return NextResponse.json({ error: '百度API认证失败: ' + tokenData.error_description }, { status: 400 })
    }
    
    const accessToken = tokenData.access_token
    
    // 调用食物识别API
    const foodUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v1/food?access_token=${accessToken}`
    
    const foodRes = await fetch(foodUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ image: imageBase64 }).toString()
    })
    
    const foodData = await foodRes.json()
    
    if (foodData.error_code) {
      return NextResponse.json({ error: '识别失败: ' + foodData.error_msg }, { status: 400 })
    }
    
    return NextResponse.json(foodData)
  } catch (error) {
    console.error('Baidu API error:', error)
    return NextResponse.json({ error: '识别服务出错' }, { status: 500 })
  }
}
