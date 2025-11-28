import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dataSource, setDataSource] = useState('جاري التحميل...')

  // بيانات تجريبية احتياطية
  const sampleProducts = [
    {
      id: 1,
      name: "كفر آيفون 15 برو - شفاف",
      price: 49.99,
      sale_price: 39.99,
      category: { name: "كفرات وحمايات" },
      stock: 50,
      sku: "CASE-IP15P-CLEAR",
      description: "كفر حماية شفاف مخصص لآيفون 15 برو، يحمي هاتفك مع الحفاظ على المظهر الأصلي."
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 محاولة الاتصال بقاعدة البيانات...')
        
        // جرب الـ API الجديد أولاً
        const apiUrls = [
          'https://mohamedalamin.wuaze.com/api/v2/products', // API الجديد
          'https://mohamedalamin.wuaze.com/api/products',    // API القديم
        ]
        
        let response;
        let apiUsed = '';
        
        for (const url of apiUrls) {
          try {
            console.log(`🔗 محاولة ${url}`)
            response = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              // إزالة no-cors للسماح بقراءة البيانات
            })
            
            if (response.ok) {
              apiUsed = url;
              break;
            }
          } catch (err) {
            console.log(`❌ فشل ${url}:`, err.message)
            continue;
          }
        }
        
        if (response && response.ok) {
          const data = await response.json()
          console.log('📦 بيانات قاعدة البيانات:', data)
          
          if (data.status === 'success' && data.data && data.data.length > 0) {
            setProducts(data.data)
            setDataSource(`بيانات حقيقية من قاعدة البيانات (${data.data.length} منتج)`)
            setError('')
            return
          }
        }
        
        // إذا فشل كل شيء، استخدم البيانات التجريبية
        throw new Error('فشل جميع محاولات الاتصال')
        
      } catch (error) {
        console.error('❌ استخدام البيانات التجريبية:', error)
        setProducts(sampleProducts)
        setDataSource('بيانات تجريبية (تعذر الاتصال بقاعدة البيانات)')
        setError('تعذر الاتصال بقاعدة البيانات: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <>
      <Head>
        <title>المنتجات - متجر الإكسسوارات</title>
      </Head>
      
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/" style={styles.backButton}>← الرئيسية</Link>
          <h1 style={styles.title}>منتجاتنا</h1>
        </header>

        <main style={styles.main}>
          {/* معلومات مصدر البيانات */}
          <div style={styles.dataSourceInfo}>
            <p>📊 {dataSource}</p>
            {error && (
              <p style={styles.errorNote}>⚠️ {error}</p>
            )}
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>جاري الاتصال بقاعدة البيانات...</p>
              <p style={styles.loadingSub}>يرجى الانتظار</p>
            </div>
          ) : (
            <>
              <div style={styles.infoBox}>
                <p>📱 عرض {products.length} منتج</p>
                <p style={styles.note}>
                  {dataSource.includes('حقيقية') ? '✅ متصل بقاعدة البيانات' : '🔄 استخدام بيانات تجريبية'}
                </p>
              </div>
              
              <div style={styles.productsGrid}>
                {products.map(product => (
                  <div key={product.id} style={styles.productCard}>
                    <div style={styles.productImage}>
                      {product.sale_price && product.sale_price < product.price && (
                        <span style={styles.saleBadge}>
                          خصم {Math.round((1 - product.sale_price / product.price) * 100)}%
                        </span>
                      )}
                      <div style={styles.imagePlaceholder}>
                        {product.images && product.images.length > 0 ? '🖼️' : '📱'}
                      </div>
                    </div>
                    
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>
                        {product.name || 'منتج بدون اسم'}
                      </h3>
                      
                      <p style={styles.productCategory}>
                        📁 {product.category?.name || 'بدون تصنيف'}
                      </p>
                      
                      <div style={styles.productPrice}>
                        {product.sale_price && product.sale_price < product.price ? (
                          <>
                            <span style={styles.currentPrice}>{product.sale_price} ر.س</span>
                            <span style={styles.oldPrice}>{product.price} ر.س</span>
                          </>
                        ) : (
                          <span style={styles.currentPrice}>
                            {product.price ? `${product.price} ر.س` : 'السعر غير متوفر'}
                          </span>
                        )}
                      </div>
                      
                      <div style={styles.productMeta}>
                        <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                          {product.stock > 0 ? `🟢 متوفر (${product.stock})` : '🔴 غير متوفر'}
                        </span>
                        <span style={styles.sku}>{product.sku || 'بدون SKU'}</span>
                      </div>

                      {product.description && (
                        <p style={styles.description}>
                          {product.description}
                        </p>
                      )}
                      
                      <div style={styles.debugInfo}>
                        <small>
                          ID: {product.id} | 
                          {dataSource.includes('حقيقية') ? ' 🗄️ قاعدة بيانات' : ' 💾 تجريبي'}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

// الأنماط تبقى كما هي مع إضافة بعض التحسينات
const styles = {
  // ... [كل الأنماط السابقة تبقى كما هي]
  dataSourceInfo: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  errorNote: {
    color: '#dc2626',
    fontSize: '0.875rem',
    margin: '0.5rem 0 0 0'
  },
  loadingSub: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.5rem'
  },
  debugInfo: {
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px dashed #e5e7eb',
    fontSize: '0.7rem',
    color: '#9ca3af',
    textAlign: 'center'
  }
}

// إضافة الـ animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}
