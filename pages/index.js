import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>متجر الإكسسوارات</title>
      </Head>
      
      <div style={styles.container}>
        <h1 style={styles.title}>🚀 متجر الإكسسوارات</h1>
        <p style={styles.subtitle}>يعمل بنجاح على Vercel!</p>
        
        <div style={styles.links}>
          <a href="/products" style={styles.button}>
            عرض المنتجات ›
          </a>
          <a 
            href="https://mohamedalamin.wuaze.com/api/products" 
            target="_blank"
            style={styles.secondaryButton}
          >
            اختبار الـ API ›
          </a>
        </div>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <h3>✅ Back-End جاهز</h3>
            <p>Laravel API يعمل على InfinityFree</p>
          </div>
          <div style={styles.feature}>
            <h3>✅ Front-End جاهز</h3>
            <p>Next.js على Vercel</p>
          </div>
          <div style={styles.feature}>
            <h3>✅ قاعدة بيانات جاهزة</h3>
            <p>MySQL مع بيانات تجريبية</p>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '2rem',
    direction: 'rtl'
  },
  title: {
    fontSize: '3rem',
    color: '#3b82f6',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#6b7280',
    marginBottom: '3rem'
  },
  links: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '4rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  secondaryButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '800px'
  },
  feature: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
}
