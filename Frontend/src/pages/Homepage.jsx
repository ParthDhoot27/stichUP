import React from 'react'
import '../styles/tokens.css'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import TailorCard from '../components/TailorCard'

const Homepage = () => {
  return (
    <div>
      <header className="section">
        <div className="container hero">
          <div>
            <div className="chip" style={{ marginBottom: 12 }}>Doorstep tailoring</div>
            <h1 style={{ margin: 0, fontSize: 36 }}>Tailoring at your doorstep</h1>
            <p style={{ marginTop: 12, fontSize: 16 }}>Find skilled tailors nearby for stitching and alterations.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <Button onClick={() => { /* navigate */ }}>Find Tailor</Button>
              <Button variant="outline" onClick={() => { /* navigate */ }}>Become a Tailor</Button>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              <Card className="feature-card">
                <div>⚡</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Fast pickup</div>
                  <div className="muted">Quick doorstep collection</div>
                </div>
              </Card>
              <Card className="feature-card">
                <div>🧵</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Skilled tailors</div>
                  <div className="muted">Verified & rated pros</div>
                </div>
              </Card>
              <Card className="feature-card">
                <div>📦</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Doorstep delivery</div>
                  <div className="muted">Track to your door</div>
                </div>
              </Card>
            </div>
          </div>
          <div>
            <div className="hero-illust" />
          </div>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 style={{ marginBottom: 12 }}>Popular nearby tailors</h2>
          <div className="grid grid-3">
            <TailorCard name="StitchUp Tailors" distanceKm={1.2} rating={4.7} reviewCount={128} priceFrom={199} onBook={() => {}} />
            <TailorCard name="Needle & Thread" distanceKm={0.8} rating={4.6} reviewCount={96} priceFrom={149} onBook={() => {}} />
            <TailorCard name="Elegant Alterations" distanceKm={1.9} rating={4.8} reviewCount={212} priceFrom={249} onBook={() => {}} />
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--c-bg)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 12 }}>What customers say</h2>
          <div className="grid grid-3">
            <Card className="testimonial-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600 }}>Aarav</div>
                <div>★★★★★</div>
              </div>
              <p className="muted" style={{ marginTop: 8 }}>Pickup was quick and fitting perfect!</p>
            </Card>
            <Card className="testimonial-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600 }}>Riya</div>
                <div>★★★★★</div>
              </div>
              <p className="muted" style={{ marginTop: 8 }}>Loved the doorstep service and updates.</p>
            </Card>
            <Card className="testimonial-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600 }}>Kabir</div>
                <div>★★★★☆</div>
              </div>
              <p className="muted" style={{ marginTop: 8 }}>Great pricing and timely delivery.</p>
            </Card>
          </div>
        </div>
      </section>

      <footer className="section">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div className="muted">© {new Date().getFullYear()} StitchUp</div>
          <div className="muted">Privacy · Terms · Support</div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage