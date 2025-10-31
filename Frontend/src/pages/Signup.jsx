import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Input from '../components/ui/Input'
import PrimaryButton from '../components/ui/PrimaryButton'
import OTPModal from '../components/OTPModal'
import Toast from '../components/Toast'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
 

const validateEmail = (v) => /.+@.+\..+/.test(v)

const Signup = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', role: 'customer' })

  // Initialize role from ?role=... if provided
  React.useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam && (roleParam === 'customer' || roleParam === 'tailor')) {
      setForm(prev => ({ ...prev, role: roleParam }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [errors, setErrors] = useState({})
  const [otpOpen, setOtpOpen] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [toast, setToast] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.email && !validateEmail(form.email)) next.email = 'Enter a valid email'
    if (!form.fullName || form.fullName.trim().length === 0) next.fullName = 'Full name is required'
    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone'
    if (!form.password || form.password.length < 6) next.password = 'Min 6 characters'
    if (!otpVerified) next.otp = 'Please verify your phone with OTP'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      // Save user to localStorage (demo). In real app call backend API.
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const existing = users.find(u => u.phone === form.phone || (form.email && u.email === form.email))
      if (existing) {
        setErrors({ form: 'User already exists with this phone/email' })
        return
      }
      const user = { fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, role: form.role }
      users.push(user)
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('currentUser', JSON.stringify(user))
      // Dispatch event to update navbar
      window.dispatchEvent(new Event('authChange'))
      setToast(true)
      setTimeout(() => setToast(false), 1200)
      // navigate to respective dashboard
      if (user.role === 'tailor') navigate('/tailor/dashboard')
      else navigate('/customer')
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 grid place-items-center px-4 py-10">
        <form onSubmit={onSubmit} className="card w-full max-w-md p-6">
          <div className="text-2xl font-semibold">Create Account</div>
          <div className="mt-4">
            <label className="text-sm font-medium">Account type</label>
            <div className="mt-2 grid grid-cols-2 divide-x divide-neutral-200 rounded-lg overflow-hidden border">
              <button
                type="button"
                aria-pressed={form.role === 'customer'}
                onClick={() => {
                  setForm({ ...form, role: 'customer' })
                  const next = Object.fromEntries([...searchParams.entries()])
                  next.role = 'customer'
                  setSearchParams(next, { replace: true })
                }}
                className={['py-3 px-4 text-center', form.role === 'customer' ? 'bg-white/5 text-(--color-primary) font-medium' : 'bg-transparent text-neutral-700'].join(' ')}
              >
                Customer
              </button>
              <button
                type="button"
                aria-pressed={form.role === 'tailor'}
                onClick={() => {
                  setForm({ ...form, role: 'tailor' })
                  const next = Object.fromEntries([...searchParams.entries()])
                  next.role = 'tailor'
                  setSearchParams(next, { replace: true })
                }}
                className={['py-3 px-4 text-center', form.role === 'tailor' ? 'bg-white/5 text-(--color-primary) font-medium' : 'bg-transparent text-neutral-700'].join(' ')}
              >
                Tailor
              </button>
            </div>
          </div>
          <div className="grid gap-4 mt-4">
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={onChange} placeholder="John Doe" error={errors.fullName} />
            <Input label="Email (optional)" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" error={errors.email} />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={(e) => { setForm({ ...form, phone: e.target.value }); if (otpVerified) setOtpVerified(false); }}
              placeholder="98765 43210"
              error={errors.phone}
              helperText="Demo: 7340015201"
              right={
                <button
                  type="button"
                  disabled={!form.phone || form.phone.replace(/\D/g, '').length < 10}
                  onClick={() => setOtpOpen(true)}
                  className={[
                    'px-3 py-1 rounded-lg border',
                    'transition-opacity',
                    (!form.phone || form.phone.replace(/\D/g, '').length < 10) ? 'opacity-50 cursor-not-allowed border-neutral-300 text-neutral-400' : 'opacity-100 border-(--color-primary) text-(--color-primary)'
                  ].join(' ')}
                >
                  Get OTP
                </button>
              }
            />
            <Input label="Password" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••" error={errors.password} helperText="Demo: 123" />
            
            <div className="flex items-center gap-2">
              <PrimaryButton
                type="submit"
                className={["flex-1 transition-opacity", !otpVerified ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''].join(' ')}
                disabled={!otpVerified}
              >
                Create Account
              </PrimaryButton>
            </div>
            <div className="text-sm text-neutral-600">Already have an account? <Link className="text-(--color-primary)" to="/login">Login</Link></div>
          </div>
        </form>
      </main>
      <Footer />
      <OTPModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={() => { setOtpVerified(true); setOtpOpen(false); }}
      />
      <Toast open={toast} type="success" message="Account created (placeholder)" />
    </div>
  )
}

export default Signup


