"use client"
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi'

type ToastType = 'success' | 'error' | 'info' | 'warning'
type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface ToastProps {
  type: ToastType
  message: string
  position?: ToastPosition
  onClose: () => void
  duration?: number
}

const toastConfig = {
  success: {
    icon: <FiCheckCircle className="w-5 h-5" />,
    color: 'bg-green-100 border-green-500 text-green-700',
  },
  error: {
    icon: <FiXCircle className="w-5 h-5" />,
    color: 'bg-red-100 border-red-500 text-red-700',
  },
  info: {
    icon: <FiInfo className="w-5 h-5" />,
    color: 'bg-blue-100 border-blue-500 text-blue-700',
  },
  warning: {
    icon: <FiAlertTriangle className="w-5 h-5" />,
    color: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  },
}

const positionStyles: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-5.5 right-6',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
}

const getAnimationProps = (position: ToastPosition) => {
  const base = { opacity: 1, scale: 1 }
  const hidden = { opacity: 0, scale: 0.8 }
  
  return {
    initial: {
      ...hidden,
      x: position.includes('left') ? -20 : position.includes('right') ? 20 : 0,
      y: position.includes('top') ? -20 : position.includes('bottom') ? 20 : 0,
    },
    animate: base,
    exit: hidden,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
}

export const Toast = ({
  type,
  message,
  position = 'top-right',
  onClose,
  duration = 3000
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <motion.div
      {...getAnimationProps(position)}
      className={`fixed ${positionStyles[position]} z-50`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${toastConfig[type].color} flex items-center p-4 rounded-lg border-l-4 shadow-lg`}>
        <div className="mr-3">{toastConfig[type].icon}</div>
        <span className="pr-4">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:opacity-70 transition-opacity"
          aria-label="Close toast"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}