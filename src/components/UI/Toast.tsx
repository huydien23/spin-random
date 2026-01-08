import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    isOpen: boolean
    onClose: () => void
    message: string
    type?: ToastType
    duration?: number
}

export default function Toast({
    isOpen,
    onClose,
    message,
    type = 'success',
    duration = 3000
}: ToastProps) {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [isOpen, duration, onClose])

    const config = {
        success: {
            icon: CheckCircle,
            colors: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            iconColor: 'text-green-500'
        },
        error: {
            icon: XCircle,
            colors: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            iconColor: 'text-red-500'
        },
        warning: {
            icon: AlertCircle,
            colors: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            iconColor: 'text-yellow-500'
        },
        info: {
            icon: Info,
            colors: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-500'
        }
    }

    const { colors, bgColor, textColor } = config[type]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-70 max-w-md w-full mx-4"
                >
                    <div className={`${bgColor} rounded-2xl shadow-2xl border-2 border-white overflow-hidden`}>
                        {/* Gradient bar */}
                        <div className={`h-1.5 bg-linear-to-r ${colors}`} />
                        
                        <div className="p-4 flex items-start gap-3">
                            {/* Message */}
                            <p className={`flex-1 font-semibold ${textColor} leading-snug`}>
                                {message}
                            </p>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className={`shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors ${textColor}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
