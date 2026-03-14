import { NextResponse } from 'next/server'

// 使用 OpenFoodFacts 免费 API
const OPEFOODFACTS_API = 'https://world.openfoodfacts.org/cgi/search.pl'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('q') || 'apple'
    const limit = searchParams.get('limit') || '10'

    const url = `${OPEFOODFACTS_API}?search_terms=${encodeURIComponent(keyword)}&search_simple=1&action=process&json=1&page_size=${limit}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ShoulLeMa/1.0 (OpenClaw App)'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from OpenFoodFacts')
    }

    const result = await response.json()
    
    const foods = (result.products || []).map((product: any) => ({
      id: product.code || product.id,
      name: product.product_name || product.product_name_en || '未知食品',
      brand: product.brands || '',
      calories: product.nutriments?.['energy-kcal_100g'] || 0,
      protein: product.nutriments?.['proteins_100g'] || 0,
      carbs: product.nutriments?.['carbohydrates_100g'] || 0,
      fat: product.nutriments?.['fat_100g'] || 0,
      servingSize: product.serving_size || '100g',
      image: product.image_small_url || ''
    })).filter((f: any) => f.name !== '未知食品')

    return NextResponse.json(foods)
  } catch (error) {
    console.error('Food API error:', error)
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 })
  }
}
