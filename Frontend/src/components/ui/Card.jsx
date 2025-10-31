import React from 'react'

const Card = ({ children, className = '', ...rest }) => {
  return (
    <div className={["card", className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}

export default Card


