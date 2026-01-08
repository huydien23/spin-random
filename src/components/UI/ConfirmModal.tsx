import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'warning'
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    const colors = {
        danger: {
            bg: 'from-red-500 to-red-600',
            icon: 'text-red-500',
            button: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
        },
        warning: {
            bg: 'from-yellow-500 to-orange-500',
            icon: 'text-yellow-500',
            button: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        },
        info: {
            bg: 'from-blue-500 to-blue-600',
            icon: 'text-blue-500',
            button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        }
    }

    const currentColor = colors[type]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className={`p-4 rounded-full bg-gradient-to-br ${currentColor.bg} bg-opacity-10`}>
                                <AlertTriangle className={`w-12 h-12 ${currentColor.icon}`} />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="text-center text-gray-600 mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 px-6 py-3 bg-gradient-to-r ${currentColor.button} text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
