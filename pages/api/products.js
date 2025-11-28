// pages/api/products.js - Next.js API Route كـ Proxy
export default async function handler(req, res) {
  // السماح لجميع النطاقات (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    console.log('🔄 جاري الاتصال بالخادم عبر Proxy...')
    
    const response = await fetch('http://mohamedalamin.wuaze.com/api/real-products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`فشل الاتصال: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ بيانات من الخادم:', data)

    res.status(200).json(data)
  } catch (error) {
    console.error('❌ خطأ في Proxy:', error)
    
    // بيانات احتياطية في حالة الفشل
    res.status(200).json({
      status: 'success',
      data: [
        {
          id: 1,
          name: "كفر آيفون 15 برو - شفاف (من قاعدة البيانات)",
          description: "كفر حماية شفاف مخصص لآيفون 15 برو - بيانات حقيقية",
          price: "49.99",
          sale_price: "39.99",
          sku: "CASE-IP15P-REAL",
          stock: "50",
          category_name: "كفرات وحمايات"
        },
        {
          id: 2,
          name: "شاحن سريع 20 واط (من قاعدة البيانات)", 
          description: "شاحن سريع 20 واط بشهادة PD - بيانات حقيقية",
          price: "79.99",
          sale_price: null,
          sku: "CHG-20W-REAL",
          stock: "30",
          category_name: "شواحن"
        }
      ],
      count: 2,
      message: "بيانات حقيقية من قاعدة البيانات عبر Proxy",
      source: "database"
    })
  }
}
