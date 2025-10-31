import React, { useState } from 'react'
import TailorLayout from '../../layouts/TailorLayout'
import Card from '../../components/ui/Card'
import PrimaryButton from '../../components/ui/PrimaryButton'

const sample = [
  { id: 'ST-2001', user: 'Aarav', service: 'Alter', cloth: 'Pant', slot: '11:00-12:00', status: 'Request' },
  { id: 'ST-2002', user: 'Riya', service: 'Stitch', cloth: 'Blouse', slot: '14:00-15:00', status: 'Request' },
]

const Orders = () => {
  const [orders, setOrders] = useState(sample)
  const update = (id, status) => setOrders(os => os.map(o => o.id===id ? { ...o, status } : o))

  return (
    <TailorLayout>
      <div className="grid lg:grid-cols-2 gap-4">
        {orders.map(o => (
          <Card key={o.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{o.id}</div>
              <div className="text-sm text-neutral-600">{o.slot}</div>
            </div>
            <div className="text-sm text-neutral-600 mt-1">{o.user} • {o.service} • {o.cloth}</div>
            <div className="mt-3 flex items-center gap-2">
              {o.status === 'Request' ? (
                <>
                  <PrimaryButton onClick={()=>update(o.id, 'Accepted')}>Accept</PrimaryButton>
                  <button className="btn-outline">Reject</button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <PrimaryButton onClick={()=>update(o.id, 'Ready')}>Mark Ready</PrimaryButton>
                  <button className="btn-outline" onClick={()=>update(o.id, 'Delivered')}>Delivered</button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </TailorLayout>
  )
}

export default Orders


