import React from 'react'
import TailorLayout from '../../layouts/TailorLayout'
import Card from '../../components/ui/Card'

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-neutral-200">
    <div>{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
)

const Earnings = () => {
  return (
    <TailorLayout>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-lg font-semibold">Wallet</div>
          <div className="text-3xl font-semibold mt-2">₹12,540</div>
          <button className="btn-primary mt-3">Withdraw</button>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="text-lg font-semibold mb-3">Earnings Summary</div>
          <Row label="Today" value="₹3,240" />
          <Row label="This Week" value="₹18,420" />
          <Row label="This Month" value="₹62,870" />
          <Row label="Platform Commission" value="₹6,287" />
        </Card>
      </div>
    </TailorLayout>
  )
}

export default Earnings


