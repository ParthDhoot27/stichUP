import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/ui/Card'
import MapPlaceholder from '../components/MapPlaceholder'
import PrimaryButton from '../components/ui/PrimaryButton'
import { FiPhone, FiMessageCircle } from 'react-icons/fi'

const Step = ({ label, active, done, time }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={["h-3.5 w-3.5 rounded-full", done ? 'bg-[color:var(--color-primary)]' : active ? 'bg-[color:var(--color-accent)]' : 'bg-neutral-300'].join(' ')} />
        <div className="w-0.5 flex-1 bg-neutral-200 my-1 last:hidden" />
      </div>
      <div>
        <div className={["text-sm", (done||active) ? 'text-[color:var(--color-text)] font-medium' : 'text-neutral-500'].join(' ')}>{label}</div>
        <div className="text-xs text-neutral-500">{time || '—'}</div>
      </div>
    </div>
  )
}

const OrderTracking = () => {
  // Mock data
  const [statusIndex, setStatusIndex] = useState(2) // 0..5
  const steps = useMemo(() => ([
    { label: 'Requested', time: '10:30 AM' },
    { label: 'Accepted', time: '10:35 AM' },
    { label: 'In Progress', time: '10:45 AM' },
    { label: 'Ready', time: '' },
    { label: 'Out for Delivery', time: '' },
    { label: 'Delivered', time: '' },
  ]), [])

  const canCancel = statusIndex <= 1

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 grid lg:grid-cols-[1fr_420px] gap-4">
        <div className="grid gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden" />
                <div>
                  <div className="font-semibold">StitchUp Tailors</div>
                  <div className="text-sm text-neutral-600">Order #ST-2049</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-outline inline-flex items-center gap-2"><FiPhone/> Call</button>
                <button className="btn-outline inline-flex items-center gap-2"><FiMessageCircle/> Chat</button>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] text-sm">
              <span className="h-2 w-2 rounded-full bg-[color:var(--color-primary)] animate-pulse" /> Live status updating
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-lg font-semibold mb-3">Status</div>
            <div className="grid" style={{gridTemplateColumns: 'auto 1fr', gap: '8px'}}>
              {steps.map((s, i) => (
                <Step key={i} label={s.label} time={s.time} active={i===statusIndex} done={i<statusIndex} />
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-lg font-semibold mb-3">Map</div>
            <MapPlaceholder className="h-48" />
          </Card>
        </div>

        <div className="grid gap-4">
          <Card className="p-5">
            <div className="text-lg font-semibold">Order Details</div>
            <div className="mt-2 text-sm text-neutral-600">Pickup: 11:00–12:00 • Service: Alter • Cloth: Pant</div>
            <div className="mt-3 flex items-center justify-between">
              <div>Subtotal</div>
              <div>₹149</div>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div>Pickup</div>
              <div>₹49</div>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div>Tax</div>
              <div>₹27</div>
            </div>
            <div className="mt-3 border-t border-neutral-200 pt-3 flex items-center justify-between font-semibold">
              <div>Total</div>
              <div>₹225</div>
            </div>
            {canCancel ? <button className="btn-outline w-full mt-4">Cancel request</button> : null}
            <PrimaryButton className="w-full mt-2">Track in real-time</PrimaryButton>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderTracking


