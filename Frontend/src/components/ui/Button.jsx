import React from 'react'

const Button = ({ children, variant = 'primary', size = 'md', iconLeft, iconRight, loading, ...rest }) => {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-outline',
  ].join(' ')

  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {iconLeft ? <span>{iconLeft}</span> : null}
      {loading ? 'Loading…' : children}
      {iconRight ? <span>{iconRight}</span> : null}
    </button>
  )
}

export default Button


