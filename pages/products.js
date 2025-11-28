import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // بيانات تجريبية مؤقتة
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
    },
    {
      id: 2,
      name: "شاحن سريع 20 واط",
      price: 79.99,
      sale_price: null,
      category: { name: "شواحن" },
      stock: 30,
      sku: "CHG-20W-FAST",
      description: "شاحن سريع 20 واط بشهادة PD، يشحن هاتفك بسرعة وأمان."
    },
    {
      id: 3,
      name: "سماعات لاسلكية بلوتوث",
      price: 129.99,
      sale_price: 99.99,
      category: { name: "سماعات" },
      stock: 25,
      sku: "EAR-WLS-BT",
      description: "سماعات لاسلكية عالية الجودة، بطارية طويلة الأمد وجودة صوت متميزة."
    },
    {
      id: 4,
      name: "حافظة أذن سلكية",
      price: 29.99,
      sale_price: 19.99,
      category: { name: "إكسسوارات متنوعة" },
      stock: 100,
      sku: "EAR-CASE-Wired",
      description: "حافظة أنيقة للسماعات السلكية، تحمي سماعاتك من التلف."
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 محاولة الاتصال بالـ API...')
        
        // استخدم fetch مع mode: 'no-cors' للتحايل على CORS مؤقتاً
        const response = await fetch('https://mohamedalamin.wuaze.com/api/products', {
          method: 'GET',
          mode: 'no-cors', // هذا يحل مشكلة CORS مؤقتاً
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        console.log('📡 حالة الاستجابة:', response)
        
        // إذا نجح الـ API، استخدم البيانات الحقيقية
        if (response.ok) {
          const data = await response.json()
          console.log('✅ البيانات الحقيقية:', data)
          if (data.status === 'success') {
            setProducts(data.data)
            setError('')
            return
          }
        }
        
        // إذا فشل الـ API، استخدم البيانات التجريبية
        console.log('🔄 استخدام البيانات التجريبية...')
        setProducts(sampleProducts)
        setError('الاتصال بالخادم: استخدام بيانات تجريبية')
        
      } catch (error) {
        console.error('❌ خطأ في الاتصال:', error)
        // في حالة الخطأ، استخدم البيانات التجريبية
        setProducts(sampleProducts)
        setError('تعذر الاتصال بالخادم: استخدام بيانات تجريبية')
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
            <div style={styles.warning}>
              <h3>ℹ️ {error}</h3>
              <p>البيانات المعروضة تجريبية للعرض</p>
            </div>
          )}

          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>جاري تحميل المنتجات...</p>
            </div>
          ) : (
            <>
              <div style={styles.infoBox}>
                <p>📱 عرض {products.length} منتج</p>
                <p style={styles.note}>
                  {error ? 'بيانات تجريبية للعرض' : 'بيانات حقيقية من الخادم'}
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
                        📱
                      </div>
                    </div>
                    
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      
                      <p style={styles.productCategory}>
                        📁 {product.category?.name}
                      </p>
                      
                      <div style={styles.productPrice}>
                        {product.sale_price && product.sale_price < product.price ? (
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
                          {product.stock > 0 ? `🟢 متوفر (${product.stock})` : '🔴 غير متوفر'}
                        </span>
                        <span style={styles.sku}>{product.sku}</span>
                      </div>

                      <p style={styles.description}>
                        {product.description}
                      </p>
                      
                      <div style={styles.actions}>
                        <button style={styles.addToCartButton}>
                          🛒 إضافة إلى السلة
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={styles.footerNote}>
                <p>
                  💡 <strong>ملاحظة:</strong> هذا متجر تجريبي. 
                  {error && ' البيانات المعروضة تجريبية لأغراض العرض.'}
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
    fontSize: '1.1rem',
    padding: '0.5rem 1rem',
    border: '2px solid #3b82f6',
    borderRadius: '6px'
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
  warning: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fcd34d',
    color: '#92400e',
    padding: '1rem',
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
  note: {
    fontSize: '0.875rem',
    color: '#1e40af',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
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
    height: '180px',
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
    fontSize: '3rem',
    opacity: 0.7
  },
  productInfo: {
    padding: '1.5rem'
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
    lineHeight: '1.4'
  },
  productCategory: {
    color: '#3b82f6',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    fontWeight: '500'
  },
  productPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  currentPrice: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  oldPrice: {
    fontSize: '1.1rem',
    color: '#9ca3af',
    textDecoration: 'line-through'
  },
  productMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#6b7280',
    marginBottom: '1rem'
  },
  inStock: {
    color: '#059669',
    fontWeight: '500',
    backgroundColor: '#ecfdf5',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px'
  },
  outOfStock: {
    color: '#dc2626',
    fontWeight: '500',
    backgroundColor: '#fef2f2',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px'
  },
  sku: {
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem'
  },
  description: {
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: '1rem 0',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '1rem'
  },
  actions: {
    marginTop: '1rem'
  },
  addToCartButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  footerNote: {
    textAlign: 'center',
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    color: '#6b7280'
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
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0,0,0,0.15);
    }
  `
  document.head.appendChild(style)
}
