import React, { useEffect, useState } from 'react'
import Modal from './ui/Modal'
import { io } from 'socket.io-client'

let socket

const ChatModal = ({ jobId, userEmail, onClose }) => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', { query: { role: 'user', id: userEmail } })
    socket.on('connect', () => console.log('chat connected'))
    socket.on('job:msg', (m) => {
      if (m.jobId === jobId) setMessages(prev => [...prev, m])
    })
    return () => socket.disconnect()
  }, [jobId])

  const send = () => {
    if (!text) return
    const msg = { jobId, sender: userEmail, text, createdAt: new Date() }
    socket.emit('job:msg', msg)
    setMessages(prev => [...prev, msg])
    setText('')
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <div className="h-64 overflow-y-auto mb-3 bg-white p-3 rounded">
          {messages.map((m, i) => (
            <div key={i} className={`mb-2 ${m.sender===userEmail?'text-right':''}`}>
              <div className="text-sm text-neutral-700">{m.text}</div>
              <div className="text-xs text-neutral-400">{new Date(m.createdAt).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border rounded" />
          <button onClick={send} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </Modal>
  )
}

export default ChatModal
