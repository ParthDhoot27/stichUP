import React from 'react'
import Card from './ui/Card'
import Button from './ui/Button'

const TailorCard = ({ name, distanceKm, rating, reviewCount, priceFrom, photoUrl, onBook }) => {
  return (
    <Card className="tailor-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 72, height: 72, borderRadius: 12, background: '#EFE9FF', border: '1px solid var(--c-border)', overflow: 'hidden' }}>
          {photoUrl ? <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{name}</h3>
            <div className="muted" style={{ fontWeight: 600 }}>{rating} ★ ({reviewCount})</div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <span className="muted">{distanceKm} km</span>
            <span className="muted">From ₹{priceFrom}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <Button onClick={onBook}>Book now</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TailorCard


