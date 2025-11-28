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
    fetchRealData()
  }, [])

  const fetchRealData = async () => {
    setLoading(true)
    setDebugInfo(['🚀 بدء جلب البيانات من الخادم...'])
    
    // روابط API التي نعرف أنها تعمل
    const endpoints = [
      {
        url: 'https://mohamedalamin.wuaze.com/api/real-products',
        name: 'API المنتجات الجديد'
      },
      {
        url: 'https://mohamedalamin.wuaze.com/api/products', 
        name: 'API المنتجات الرئيسي'
      },
      {
        url: 'https://mohamedalamin.wuaze.com/api/test',
        name: 'API الاختبار'
      }
    ]

    for (const endpoint of endpoints) {
      try {
        setDebugInfo(prev => [...prev, `🔗 جاري تجربة: ${endpoint.name}`])
        console.log(`🔄 محاولة ${endpoint.name}: ${endpoint.url}`)
        
        const response = await fetch(endpoint.url)
        console.log(`📡 حالة ${endpoint.name}:`, response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ استجابة ${endpoint.name}:`, data)
          
          if (endpoint.url.includes('test')) {
            // إذا كان API الاختبار
            setDebugInfo(prev => [...prev, `✅ الخادم يعمل: ${data.message}`])
            continue
          }
          
          if (data.status === 'success' && data.data && data.data.length > 0) {
            setProducts(data.data)
            setDataSource(`✅ ${endpoint.name}`)
            setError('')
            setDebugInfo(prev => [...prev, `🎉 نجاح! تم جلب ${data.data.length} منتج من قاعدة البيانات`])
            setLoading(false)
            return
          } else {
            setDebugInfo(prev => [...prev, `⚠️ ${endpoint.name}: البيانات فارغة`])
          }
        } else {
          setDebugInfo(prev => [...prev, `❌ ${endpoint.name}: فشل (${response.status})`])
        }
      } catch (err) {
        setDebugInfo(prev => [...prev, `❌ ${endpoint.name}: ${err.message}`])
      }
    }

    // إذا فشلت جميع المحاولات
    setDebugInfo(prev => [...prev, '💾 استخدام البيانات الاحتياطية...'])
    useBackupData()
  }

  const useBackupData = () => {
    const backupProducts = [
      {
        id: 1,
        name: "كفر آيفون 15 برو - شفاف",
        description: "كفر حماية شفاف مخصص لآيفون 15 برو، يحمي هاتفك مع الحفاظ على المظهر الأصلي.",
        price: "49.99",
        sale_price: "39.99",
        sku: "CASE-IP15P-CLEAR",
        stock: "50",
        category_name: "كفرات وحمايات"
      },
      {
        id: 2, 
        name: "شاحن سريع 20 واط",
        description: "شاحن سريع 20 واط بشهادة PD، يشحن هاتفك بسرعة وأمان.",
        price: "79.99",
        sale_price: null,
        sku: "CHG-20W-FAST", 
        stock: "30",
        category_name: "شواحن"
      },
      {
        id: 3,
        name: "سماعات لاسلكية بلوتوث",
        description: "سماعات لاسلكية عالية الجودة، بطارية طويلة الأمد وجودة صوت متميزة.",
        price: "129.99",
        sale_price: "99.99",
        sku: "EAR-WLS-BT",
        stock: "25", 
        category_name: "سماعات"
      }
    ]
    
    setProducts(backupProducts)
    setDataSource('💾 بيانات احتياطية')
    setError('تعذر الاتصال بقاعدة البيانات الحقيقية')
    setDebugInfo(prev => [...prev, '✅ تم تحميل 3 منتج من البيانات الاحتياطية'])
    setLoading(false)
  }

  const retryConnection = () => {
    setLoading(true)
    setError('')
    setDebugInfo(['🔄 إعادة محاولة الاتصال...'])
    fetchRealData()
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
              <strong>الحالة:</strong> {loading ? '🔄 جاري التحميل...' : dataSource.includes('✅') ? '✅ متصل' : '❌ غير متصل'}
            </div>
            <div style={styles.source}>
              <strong>مصدر البيانات:</strong> {dataSource || 'جاري التحديد...'}
            </div>
            {error && <div style={styles.error}>⚠️ {error}</div>}
            
            <button onClick={retryConnection} style={styles.retryBtn}>
              🔄 إعادة المحاولة
            </button>
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
              <p>جاري الاتصال بخادم قاعدة البيانات...</p>
              <p style={styles.note}>يتم محاولة الاتصال بـ: api/real-products</p>
            </div>
          ) : (
            <>
              <div style={styles.stats}>
                <h2>📦 قائمة المنتجات</h2>
                <p>يتم عرض {products.length} منتج {dataSource.includes('احتياطية') ? 'من البيانات الاحتياطية' : 'من قاعدة البيانات الحقيقية'}</p>
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
                        <span style={dataSource.includes('احتياطية') ? styles.backup : styles.real}>
                          {dataSource.includes('احتياطية') ? '💾 احتياطي' : '🗃️ حقيقي'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.help}>
                <h4>💡 ملاحظة:</h4>
                <p>لرؤية البيانات الحقيقية من قاعدة البيانات، تأكد من:</p>
                <ul>
                  <li>وجود ملف <code>api/real-products.php</code> في الخادم</li>
                  <li>أن قاعدة البيانات تحتوي على منتجات</li>
                  <li>أن الـ API يعيد استجابة JSON صحيحة</li>
                </ul>
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
    marginBottom: '1rem',
    textAlign: 'center'
  },
  status: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem'
  },
  source: {
    marginBottom: '0.5rem'
  },
  error: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: '1rem'
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
    overflow: 'hidden',
    transition: 'transform 0.2s'
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
  help: {
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
    code {
      background: #f3f4f6;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
    }
  `
  document.head.appendChild(style)
}
