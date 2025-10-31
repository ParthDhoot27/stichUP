import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Input from '../components/ui/Input'
import PrimaryButton from '../components/ui/PrimaryButton'
import OTPModal from '../components/OTPModal'
import Toast from '../components/Toast'
import { Link, useNavigate } from 'react-router-dom'
 


const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '7340015201', password: '123456' })
  const [errors, setErrors] = useState({})
  const [otpOpen, setOtpOpen] = useState(false)
  const [toast, setToast] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Seed a demo account if not present
  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const hasDemo = users.some(u => (u.phone || '').replace(/\D/g, '') === '7340015201')
      if (!hasDemo) {
        users.push({ phone: '7340015201', password: '123456', name: 'Demo User', role: 'customer' })
        localStorage.setItem('users', JSON.stringify(users))
      }
    } catch {}
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone'
    if (!form.password || form.password.length < 6) next.password = 'Min 6 characters'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      // Check stored users (demo). In real app call backend API.
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const inputPhone = (form.phone || '').replace(/\D/g, '')
      const user = users.find(u => ((u.phone || '').replace(/\D/g, '') === inputPhone) && u.password === form.password)
      if (!user) {
        setErrors({ form: 'Invalid phone or password' })
        return
      }
      localStorage.setItem('currentUser', JSON.stringify(user))
      // Dispatch event to update navbar
      window.dispatchEvent(new Event('authChange'))
      if (user.role === 'tailor') navigate('/tailor/dashboard')
      else navigate('/customer')
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 grid place-items-center px-4 py-10">
        <form onSubmit={onSubmit} className="card w-full max-w-md p-6">
          <div className="text-2xl font-semibold">Login</div>
          <div className="grid gap-4 mt-4">
            {/* <Input label="Email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" error={errors.email} /> */}
            <Input label="Phone" name="phone" value={form.phone} onChange={onChange} placeholder="98765 43210" error={errors.phone} helperText="Demo: 7340015201" />
            <Input label="Password" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••" error={errors.password} helperText="Demo: 123456" />
            <div className="flex items-center gap-2">
              <PrimaryButton type="submit" className="flex-1" onClick={handleLoginClick}>Login</PrimaryButton>
              <button type="button" className="btn-outline" onClick={() => setOtpOpen(true)}>Get OTP</button>
            </div>
            {errors.form && (
              <div className="mt-2 text-sm text-red-600">{errors.form}</div>
            )}
            <div className="text-sm text-neutral-600">Don't have an account? <Link className="text-(--color-primary)" to="/signup">Sign up</Link></div>
          </div>
        </form>
      </main>
      <Footer />
      <OTPModal open={otpOpen} onClose={() => setOtpOpen(false)} />
      <Toast open={toast} type="success" message="Logged in (placeholder)" />
    </div>
  )
}

export default Login


