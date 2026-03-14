import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const configFile = path.join(process.cwd(), 'data', 'baidu_config.json')

// 读取百度API配置
function getBaiduConfig() {
  try {
    if (fs.existsSync(configFile)) {
      return JSON.parse(fs.readFileSync(configFile, 'utf-8'))
    }
  } catch (e) {}
  return { apiKey: '', secretKey: '' }
}

// 保存百度API配置
export async function POST(request: Request) {
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

// 百度食物识别API
export async function GET(request: Request) {
  try {
    const config = getBaiduConfig()
    
    if (!config.apiKey || !config.secretKey) {
      return NextResponse.json({ 
        error: '请先配置百度API Key',
        needConfig: true 
      }, { status: 400 })
    }
    
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    const imageBase64 = searchParams.get('base64')
    
    // 获取access_token
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.apiKey}&client_secret=${config.secretKey}`
    
    const tokenRes = await fetch(tokenUrl, { method: 'POST' })
    const tokenData = await tokenRes.json()
    
    if (tokenData.error) {
      return NextResponse.json({ error: '百度API认证失败: ' + tokenData.error_description }, { status: 400 })
    }
    
    const accessToken = tokenData.access_token
    
    // 调用食物识别API
    let body = {}
    if (imageBase64) {
      body = { image: imageBase64 }
    } else if (imageUrl) {
      body = { image: imageUrl }
    } else {
      return NextResponse.json({ error: '缺少图片参数' }, { status: 400 })
    }
    
    const foodUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v1/food?access_token=${accessToken}`
    
    const foodRes = await fetch(foodUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body).toString()
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
