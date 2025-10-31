import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Input from '../components/ui/Input'
import PrimaryButton from '../components/ui/PrimaryButton'
import OTPModal from '../components/OTPModal'
import Toast from '../components/Toast'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'

const validateEmail = (v) => /.+@.+\..+/.test(v)

const Login = () => {
  const [form, setForm] = useState({ email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [otpOpen, setOtpOpen] = useState(false)
  const [toast, setToast] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.email && !form.phone) next.email = 'Email or phone is required'
    if (form.email && !validateEmail(form.email)) next.email = 'Enter a valid email'
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone'
    if (!form.password || form.password.length < 6) next.password = 'Min 6 characters'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 grid place-items-center px-4 py-10">
        <form onSubmit={onSubmit} className="card w-full max-w-md p-6">
          <div className="text-2xl font-semibold">Login</div>
          <div className="grid gap-4 mt-4">
            <Input label="Email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" error={errors.email} />
            <Input label="Phone" name="phone" value={form.phone} onChange={onChange} placeholder="98765 43210" error={errors.phone} />
            <Input label="Password" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••" error={errors.password} />
            <div className="flex items-center gap-2">
              <PrimaryButton type="submit" className="flex-1">Login</PrimaryButton>
              <button type="button" className="btn-outline" onClick={() => setOtpOpen(true)}>Get OTP</button>
            </div>
            <button type="button" className="btn-outline w-full flex items-center justify-center gap-2"><FcGoogle /> Continue with Google</button>
            <div className="text-sm text-neutral-600">Don't have an account? <Link className="text-[color:var(--color-primary)]" to="/signup">Sign up</Link></div>
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


