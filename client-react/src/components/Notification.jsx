import { useEffect } from 'react'

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className={`alert alert-${type} position-fixed d-flex justify-content-between align-items-center`}
      style={{ top: '1rem', right: '1rem', zIndex: 9999, minWidth: 300, animation: 'slideIn 0.3s ease-out' }}
    >
      <span>{message}</span>
      <button type="button" className="btn-close btn-close-white ms-3" onClick={onClose}></button>
    </div>
  )
}
