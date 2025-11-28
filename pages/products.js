import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 بدء جلب البيانات...')
        const response = await fetch('https://mohamedalamin.wuaze.com/api/products')
        console.log('📡 حالة الاستجابة:', response.status)
        
        const rawData = await response.text()
        console.log('📦 البيانات الخام:', rawData)
        
        const data = JSON.parse(rawData)
        console.log('📊 البيانات بعد التحليل:', data)
        
        if (data.status === 'success' && data.data) {
          console.log('✅ عدد المنتجات:', data.data.length)
          setProducts(data.data)
          setError('')
        } else {
          console.log('❌ بيانات غير متوقعة:', data)
          setError('بيانات غير متوقعة من الخادم')
        }
      } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error)
        setError('فشل في تحليل البيانات: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // دالة لإصلاح الترميز العربي
  const fixArabicEncoding = (text) => {
    if (!text) return 'بدون وصف'
    
    try {
      // إذا كان النص يحتوي على رموز Unicode
      if (text.includes('\\u')) {
        return JSON.parse(`"${text}"`)
      }
      return text
    } catch {
      return text
    }
  }

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
          {error && (
            <div style={styles.error}>
              <h3>⚠️ {error}</h3>
              <p>افتح Console للمزيد من المعلومات</p>
            </div>
          )}

          {loading && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div style={styles.infoBox}>
                <p>📱 عرض {products.length} منتج</p>
                <p style={styles.debugInfo}>
                  آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
                </p>
              </div>
              
              {products.length === 0 ? (
                <div style={styles.empty}>
                  <h3>📭 لا توجد منتجات</h3>
                  <p>لم يتم العثور على منتجات في قاعدة البيانات</p>
                  <button 
                    onClick={() => window.location.reload()}
                    style={styles.retryButton}
                  >
                    إعادة تحميل
                  </button>
                </div>
              ) : (
                <div style={styles.productsGrid}>
                  {products.map((product, index) => (
                    <div key={product.id || index} style={styles.productCard}>
                      <div style={styles.productImage}>
                        {product.sale_price && (
                          <span style={styles.saleBadge}>خصم</span>
                        )}
                        <div style={styles.imagePlaceholder}>
                          {product.name ? product.name.charAt(0) : '?'}
                        </div>
                      </div>
                      
                      <div style={styles.productInfo}>
                        <h3 style={styles.productName}>
                          {product.name ? fixArabicEncoding(product.name) : 'منتج بدون اسم'}
                        </h3>
                        
                        <p style={styles.productCategory}>
                          {product.category?.name ? fixArabicEncoding(product.category.name) : 'بدون تصنيف'}
                        </p>
                        
                        <div style={styles.productPrice}>
                          {product.sale_price ? (
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
                          <span style={
                            product.stock > 0 ? styles.inStock : styles.outOfStock
                          }>
                            {product.stock > 0 ? '🟢 متوفر' : '🔴 غير متوفر'}
                          </span>
                          <span style={styles.sku}>
                            {product.sku || 'بدون SKU'}
                          </span>
                        </div>

                        {product.description && (
                          <p style={styles.description}>
                            {fixArabicEncoding(product.description)}
                          </p>
                        )}
                        
                        <div style={styles.debug}>
                          <small>ID: {product.id} | المخزون: {product.stock}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif',
    direction: 'rtl'
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  title: {
    fontSize: '1.5rem',
    color: '#1f2937',
    margin: 0
  },
  main: {
    padding: '1rem'
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  debugInfo: {
    fontSize: '0.75rem',
    color: '#1e40af',
    margin: '0.25rem 0 0 0'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem 1rem'
  },
  spinner: {
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#6b7280'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    border: '2px solid #e5e7eb'
  },
  productImage: {
    position: 'relative',
    height: '150px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  saleBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  imagePlaceholder: {
    width: '60px',
    height: '60px',
    backgroundColor: '#d1d5db',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: '#6b7280',
    fontWeight: 'bold'
  },
  productInfo: {
    padding: '1rem'
  },
  productName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
    lineHeight: '1.4'
  },
  productCategory: {
    color: '#3b82f6',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    fontWeight: '500'
  },
  productPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  currentPrice: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  oldPrice: {
    fontSize: '1rem',
    color: '#9ca3af',
    textDecoration: 'line-through'
  },
  productMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  inStock: {
    color: '#059669',
    fontWeight: '500'
  },
  outOfStock: {
    color: '#dc2626',
    fontWeight: '500'
  },
  sku: {
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px'
  },
  description: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.4',
    margin: '0.5rem 0',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '0.5rem'
  },
  debug: {
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px dashed #e5e7eb',
    fontSize: '0.7rem',
    color: '#9ca3af'
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '1rem'
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
