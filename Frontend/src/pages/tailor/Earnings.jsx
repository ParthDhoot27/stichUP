import React, { useState, useEffect } from 'react'
import TailorLayout from '../../layouts/TailorLayout'
import Card from '../../components/ui/Card'
import PrimaryButton from '../../components/ui/PrimaryButton'
import { FiCalendar } from 'react-icons/fi'

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-neutral-200">
    <div>{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
)

// Sample daily payment history data
const sampleDailyHistory = [
  { date: '2024-01-15', paymentsCount: 5, totalAmount: 3240, availableToWithdraw: 3240 },
  { date: '2024-01-14', paymentsCount: 3, totalAmount: 1890, availableToWithdraw: 5130 },
  { date: '2024-01-13', paymentsCount: 7, totalAmount: 4120, availableToWithdraw: 9250 },
  { date: '2024-01-12', paymentsCount: 4, totalAmount: 2450, availableToWithdraw: 11700 },
  { date: '2024-01-11', paymentsCount: 6, totalAmount: 3480, availableToWithdraw: 15180 },
  { date: '2024-01-10', paymentsCount: 2, totalAmount: 1200, availableToWithdraw: 16380 },
]

const Earnings = () => {
  const [dailyHistory, setDailyHistory] = useState(sampleDailyHistory)
  const [totalWallet, setTotalWallet] = useState(12540)
  const [totalAvailable, setTotalAvailable] = useState(12540)

  useEffect(() => {
    // Load payment history from localStorage if available
    try {
      const history = JSON.parse(localStorage.getItem('tailorPaymentHistory') || '[]')
      if (history.length > 0) {
        setDailyHistory(history)
        // Calculate total available from history
        const available = history.length > 0 ? history[0].availableToWithdraw : 0
        setTotalAvailable(available)
        setTotalWallet(available)
      }
    } catch (error) {
      console.error('Error loading payment history:', error)
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <TailorLayout>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-lg font-semibold">Wallet</div>
          <div className="text-3xl font-semibold mt-2">₹{totalWallet.toLocaleString('en-IN')}</div>
          <div className="text-sm text-neutral-600 mt-1">Available to withdraw</div>
          <PrimaryButton className="mt-3 w-full">Withdraw</PrimaryButton>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="text-lg font-semibold mb-3">Earnings Summary</div>
          <Row label="Today" value="₹3,240" />
          <Row label="This Week" value="₹18,420" />
          <Row label="This Month" value="₹62,870" />
          <Row label="Platform Commission" value="₹6,287" />
        </Card>
      </div>

      {/* Daily Payment History */}
      <Card className="p-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="w-5 h-5 text-[color:var(--color-primary)]" />
          <div className="text-lg font-semibold">Daily Payment History</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-600 border-b border-neutral-200">
                <th className="py-3 px-2 font-semibold">Date</th>
                <th className="py-3 px-2 font-semibold">Payments</th>
                <th className="py-3 px-2 font-semibold text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {dailyHistory.map((day, index) => (
                <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-2">
                    <div className="font-medium">{formatDate(day.date)}</div>
                    <div className="text-xs text-neutral-500">{day.date}</div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{day.paymentsCount}</span>
                      <span className="text-neutral-600 text-xs">
                        {day.paymentsCount === 1 ? 'payment' : 'payments'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="font-semibold text-green-700">₹{day.totalAmount.toLocaleString('en-IN')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {dailyHistory.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              No payment history available
            </div>
          )}
        </div>
      </Card>
    </TailorLayout>
  )
}

export default Earnings


