import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dataSource, setDataSource] = useState('')
  const [debugInfo, setDebugInfo] = useState([])

  useEffect(() => {
    fetchDataThroughProxy()
  }, [])

  const fetchDataThroughProxy = async () => {
    setLoading(true)
    setDebugInfo(['🚀 بدء جلب البيانات عبر Next.js API...'])
    
    try {
      setDebugInfo(prev => [...prev, '🔗 جاري الاتصال عبر /api/products...'])
      console.log('🔄 بدء الاتصال بالـ API Route...')
      
      // الاتصال بـ Next.js API Route
      const response = await fetch('/api/products')
      console.log('📡 حالة API Route:', response.status)
      
      if (!response.ok) {
        throw new Error(`فشل API Route: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📦 بيانات من API Route:', data)
      
      if (data.status === 'success' && data.data) {
        setProducts(data.data)
        setDataSource(`✅ ${data.source === 'database' ? 'بيانات حقيقية من قاعدة البيانات' : data.message}`)
        setError('')
        setDebugInfo(prev => [...prev, `🎉 نجاح! ${data.data.length} منتج عبر API Route`])
      } else {
        throw new Error('بيانات غير متوقعة من API Route')
      }
      
    } catch (err) {
      console.error('❌ خطأ في API Route:', err)
      setDebugInfo(prev => [...prev, `❌ فشل API Route: ${err.message}`])
      useBackupData()
    } finally {
      setLoading(false)
    }
  }

  const useBackupData = () => {
    const backupProducts = [
      {
        id: 1,
        name: "كفر آيفون 15 برو - شفاف (بيانات احتياطية)",
        description: "كفر حماية شفاف مخصص لآيفون 15 برو - بيانات احتياطية للعرض",
        price: "49.99",
        sale_price: "39.99",
        sku: "CASE-IP15P-BACKUP",
        stock: "50",
        category_name: "كفرات وحمايات"
      },
      {
        id: 2, 
        name: "شاحن سريع 20 واط (بيانات احتياطية)",
        description: "شاحن سريع 20 واط بشهادة PD - بيانات احتياطية للعرض",
        price: "79.99",
        sale_price: null,
        sku: "CHG-20W-BACKUP", 
        stock: "30",
        category_name: "شواحن"
      },
      {
        id: 3,
        name: "سماعات لاسلكية بلوتوث (بيانات احتياطية)",
        description: "سماعات لاسلكية عالية الجودة - بيانات احتياطية للعرض",
        price: "129.99",
        sale_price: "99.99",
        sku: "EAR-WLS-BACKUP",
        stock: "25", 
        category_name: "سماعات"
      }
    ]
    
    setProducts(backupProducts)
    setDataSource('💾 بيانات احتياطية')
    setError('تعذر الاتصال بـ Next.js API Route')
    setDebugInfo(prev => [...prev, '✅ تم تحميل 3 منتج من البيانات الاحتياطية'])
  }

  const retryConnection = () => {
    setLoading(true)
    setError('')
    setDebugInfo(['🔄 إعادة محاولة الاتصال...'])
    fetchDataThroughProxy()
  }

  const testDirectConnection = () => {
    window.open('https://mohamedalamin.wuaze.com/api/real-products', '_blank')
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
          {/* لوحة التحكم */}
          <div style={styles.controlPanel}>
            <div style={styles.status}>
              <strong>الحالة:</strong> {loading ? '🔄 جاري التحميل...' : dataSource.includes('✅') ? '✅ متصل' : '💾 احتياطي'}
            </div>
            <div style={styles.source}>
              <strong>مصدر البيانات:</strong> {dataSource || 'جاري التحديد...'}
            </div>
            
            <div style={styles.actions}>
              <button onClick={retryConnection} style={styles.retryBtn}>
                🔄 إعادة المحاولة
              </button>
              <button onClick={testDirectConnection} style={styles.testBtn}>
                🔗 اختبار API مباشرة
              </button>
            </div>
          </div>

          {/* سجل التصحيح */}
          <div style={styles.debugPanel}>
            <h4>📋 سجل المحاولات:</h4>
            <div style={styles.debugLog}>
              {debugInfo.map((info, index) => (
                <div key={index} style={styles.debugLine}>
                  {info}
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>جاري الاتصال بقاعدة البيانات عبر Next.js API...</p>
              <p style={styles.note}>المسار: /api/products/index.js</p>
            </div>
          ) : (
            <>
              <div style={styles.stats}>
                <h2>📦 قائمة المنتجات ({products.length})</h2>
                <p>
                  {dataSource.includes('حقيقية') ? 
                    '🎉 يتم عرض بيانات حقيقية من قاعدة البيانات!' : 
                    '💾 يتم عرض بيانات احتياطية للعرض'}
                </p>
              </div>
              
              <div style={styles.productsGrid}>
                {products.map(product => (
                  <div key={product.id} style={styles.productCard}>
                    <div style={styles.productImage}>
                      {product.sale_price && (
                        <span style={styles.saleBadge}>
                          🔥 خصم
                        </span>
                      )}
                      <div style={styles.imagePlaceholder}>
                        {product.category_name?.includes('كفر') ? '📱' : 
                         product.category_name?.includes('شاحن') ? '⚡' : 
                         product.category_name?.includes('سماعات') ? '🎧' : '📦'}
                      </div>
                    </div>
                    
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.category}>📁 {product.category_name}</p>
                      
                      <div style={styles.price}>
                        {product.sale_price ? (
                          <>
                            <span style={styles.salePrice}>{product.sale_price} ر.س</span>
                            <span style={styles.originalPrice}>{product.price} ر.س</span>
                          </>
                        ) : (
                          <span style={styles.normalPrice}>{product.price} ر.س</span>
                        )}
                      </div>
                      
                      <div style={styles.meta}>
                        <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                          {product.stock > 0 ? `🟢 متوفر (${product.stock})` : '🔴 غير متوفر'}
                        </span>
                        <span style={styles.sku}>{product.sku}</span>
                      </div>
                      
                      <p style={styles.description}>{product.description}</p>
                      
                      <div style={styles.footer}>
                        <span style={styles.id}># {product.id}</span>
                        <span style={dataSource.includes('حقيقية') ? styles.real : styles.backup}>
                          {dataSource.includes('حقيقية') ? '🗃️ قاعدة بيانات' : '💾 احتياطي'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.technicalInfo}>
                <h4>🔧 معلومات تقنية:</h4>
                <p>
                  <strong>البنية:</strong> Front-End → Next.js API Route → Back-End<br/>
                  <strong>الحالة:</strong> {dataSource.includes('حقيقية') ? '✅ يعمل عبر Proxy' : '❌ يحتاج إصلاح'}<br/>
                  <strong>المسار:</strong> /api/products/index.js
                </p>
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
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  controlPanel: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  },
  status: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  source: {
    marginBottom: '1rem',
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  retryBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  testBtn: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  debugPanel: {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    fontSize: '0.9rem'
  },
  debugLog: {
    marginTop: '0.5rem'
  },
  debugLine: {
    margin: '0.25rem 0',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.8rem'
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
  note: {
    color: '#6b7280',
    fontSize: '0.9rem'
  },
  stats: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  imagePlaceholder: {
    fontSize: '2.5rem',
    opacity: 0.7
  },
  productInfo: {
    padding: '1.5rem'
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  category: {
    color: '#3b82f6',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  salePrice: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  originalPrice: {
    fontSize: '1.1rem',
    color: '#9ca3af',
    textDecoration: 'line-through'
  },
  normalPrice: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
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
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px'
  },
  description: {
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6'
  },
  id: {
    color: '#9ca3af',
    fontSize: '0.8rem'
  },
  real: {
    color: '#059669',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  backup: {
    color: '#d97706',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  technicalInfo: {
    backgroundColor: '#f0f9ff',
    padding: '1.5rem',
    borderRadius: '12px',
    marginTop: '2rem'
  }
}

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
