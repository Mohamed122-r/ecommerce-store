import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://mohamedalamin.wuaze.com/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProducts(data.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Head>
        <title>المنتجات - متجر الإكسسوارات</title>
      </Head>
      
      <div style={styles.container}>
        <header style={styles.header}>
          <a href="/" style={styles.backButton}>← الرئيسية</a>
          <h1 style={styles.title}>منتجاتنا</h1>
        </header>

        <main style={styles.main}>
          {loading ? (
            <div style={styles.loading}>جاري تحميل المنتجات...</div>
          ) : (
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
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productCategory}>{product.category?.name}</p>
                    
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
                      <span style={styles.stock}>
                        {product.stock > 0 ? '🟢 متوفر' : '🔴 غير متوفر'}
                      </span>
                      <span style={styles.sku}>SKU: {product.sku}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    padding: '2rem',
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
    fontWeight: 'bold'
  },
  title: {
    fontSize: '2.5rem',
    color: '#1f2937',
    margin: 0
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.25rem',
    color: '#6b7280',
    padding: '4rem'
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
    transition: 'transform 0.2s'
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
    fontSize: '3rem'
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
    color: '#6b7280'
  },
  stock: {
    fontWeight: '500'
  },
  sku: {
    fontFamily: 'monospace'
  }
}
