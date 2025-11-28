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
        console.log('🔍 جاري جلب البيانات من API...')
        const response = await fetch('https://mohamedalamin.wuaze.com/api/products')
        const data = await response.json()
        
        console.log('📦 بيانات الـ API:', data)
        
        if (data.status === 'success') {
          setProducts(data.data)
          setError('')
        } else {
          setError('فشل في جلب البيانات من الخادم')
        }
      } catch (err) {
        console.error('❌ خطأ في جلب البيانات:', err)
        setError('تعذر الاتصال بالخادم')
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
          {error && (
            <div style={styles.error}>
              <h3>⚠️ {error}</h3>
              <p>تفقد وحدة التحكم (Console) للمزيد من المعلومات</p>
              <button 
                onClick={() => window.location.reload()}
                style={styles.retryButton}
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {loading && !error && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={styles.empty}>
              <h3>📭 لا توجد منتجات</h3>
              <p>لم يتم العثور على أي منتجات في قاعدة البيانات</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div style={styles.stats}>
                <p>عرض {products.length} منتج</p>
              </div>
              
              <div style={styles.productsGrid}>
                {products.map(product => (
                  <div key={product.id} style={styles.productCard}>
                    <div style={styles.productImage}>
                      {product.sale_price && (
                        <span style={styles.saleBadge}>خصم</span>
                      )}
                      <div style={styles.imagePlaceholder}>
                        {product.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productCategory}>
                        📁 {product.category?.name || 'بدون تصنيف'}
                      </p>
                      
                      <div style={styles.productPrice}>
                        {product.sale_price ? (
                          <>
                            <span style={styles.currentPrice}>{product.sale_price} ر.س</span>
                            <span style={styles.oldPrice}>{product.price} ر.س</span>
                          </>
                        ) : (
                          <span style={styles.currentPrice}>{product.price} ر.س</span>
                        )}
                      </div>
                      
                      <div style={styles.productMeta}>
                        <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                          {product.stock > 0 ? '🟢 متوفر' : '🔴 غير متوفر'}
                        </span>
                        <span style={styles.sku}>SKU: {product.sku}</span>
                      </div>

                      {product.description && (
                        <p style={styles.description}>
                          {product.description.substring(0, 100)}...
                        </p>
                      )}
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif',
    direction: 'rtl'
  },
  header: {
    backgroundColor: 'white',
    padding: '1.5rem 2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    right: '2rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '2px solid #3b82f6'
  },
  title: {
    fontSize: '2rem',
    color: '#1f2937',
    margin: 0
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem'
  },
  spinner: {
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    color: '#6b7280'
  },
  stats: {
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#6b7280'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  productImage: {
    position: 'relative',
    height: '200px',
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
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold'
  },
  imagePlaceholder: {
    width: '80px',
    height: '80px',
    backgroundColor: '#d1d5db',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: '#6b7280'
  },
  productInfo: {
    padding: '1.5rem'
  },
  productName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  productCategory: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  productPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  currentPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  oldPrice: {
    fontSize: '1.125rem',
    color: '#9ca3af',
    textDecoration: 'line-through'
  },
  productMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem'
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
    fontFamily: 'monospace'
  },
  description: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.5',
    marginTop: '1rem'
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

// إضافة الـ animation للـ spinner
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
