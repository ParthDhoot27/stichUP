import React from 'react'

const OTPModal = ({ open, onClose, onVerify }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center px-4">
        <div className="card p-5 w-full max-w-sm bg-white">
          <div className="text-lg font-semibold">Enter OTP</div>
          <div className="text-neutral-600 text-sm">We sent a 6 digit code to your phone</div>
          <div className="mt-4 flex items-center justify-between gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input key={i} maxLength={1} className="w-10 h-12 text-center border rounded-lg border-neutral-300 focus:outline-none" />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 justify-end">
            <button className="btn-outline" onClick={onClose}>Close</button>
            <button className="btn-primary" onClick={() => { if (onVerify) onVerify(); }}>Verify</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPModal


