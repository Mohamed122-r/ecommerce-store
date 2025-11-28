import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://mohamedalamin.wuaze.com/api/products')
        const data = await response.json()
        
        console.log('📦 البيانات المستلمة:', data)
        
        if (data.status === 'success') {
          setProducts(data.data)
        }
      } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // دالة لإصلاح الترميز العربي
  const fixArabicEncoding = (text) => {
    if (!text) return ''
    
    // إذا كان النص يحتوي على رموز Unicode، قم بتحويله
    if (text.includes('\\u')) {
      try {
        return JSON.parse(`"${text}"`)
      } catch {
        return text
      }
    }
    
    return text
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
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          ) : (
            <>
              <div style={styles.infoBox}>
                <p>📱 عرض {products.length} منتج</p>
                <p style={styles.note}>بيانات حقيقية من قاعدة البيانات</p>
              </div>
              
              <div style={styles.productsGrid}>
                {products.map(product => (
                  <div key={product.id} style={styles.productCard}>
                    <div style={styles.productImage}>
                      {product.sale_price && (
                        <span style={styles.saleBadge}>خصم</span>
                      )}
                      <div style={styles.imagePlaceholder}>
                        📱
                      </div>
                    </div>
                    
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>
                        {fixArabicEncoding(product.name)}
                      </h3>
                      <p style={styles.productCategory}>
                        {fixArabicEncoding(product.category?.name)}
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
                        <span style={styles.sku}>{product.sku}</span>
                      </div>

                      <p style={styles.description}>
                        {fixArabicEncoding(product.description)}
                      </p>
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
  infoBox: {
    backgroundColor: '#d1fae5',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  note: {
    fontSize: '0.875rem',
    color: '#065f46',
    margin: '0.5rem 0 0 0'
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
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
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
    fontSize: '2.5rem'
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
    margin: 0,
    borderTop: '1px solid #f3f4f6',
    paddingTop: '0.5rem'
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
