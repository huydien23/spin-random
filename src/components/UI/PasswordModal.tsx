import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Eye, EyeOff, Shield } from 'lucide-react'

interface PasswordModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

// Default admin password - có thể thay đổi
const ADMIN_PASSWORD = 'vhu2026'

export default function PasswordModal({ isOpen, onClose, onSuccess }: PasswordModalProps) {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isShaking, setIsShaking] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password === ADMIN_PASSWORD) {
            // Save session to sessionStorage (chỉ tồn tại trong tab hiện tại)
            sessionStorage.setItem('vhu_admin_authenticated', 'true')
            setPassword('')
            setError('')
            onSuccess()
        } else {
            setError('Mật khẩu không chính xác!')
            setIsShaking(true)
            setTimeout(() => setIsShaking(false), 500)
        }
    }

    const handleClose = () => {
        setPassword('')
        setError('')
        onClose()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                            x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ 
                            type: 'spring', 
                            damping: 25, 
                            stiffness: 300,
                            x: { duration: 0.4 }
                        }}
                        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#0054A6] to-[#003D7A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Xác thực Admin
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Nhập mật khẩu để truy cập quản lý
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    ref={inputRef}
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="Nhập mật khẩu..."
                                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20 transition-all ${
                                        error 
                                            ? 'border-red-400 focus:border-red-500' 
                                            : 'border-gray-200 focus:border-[#0054A6]'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Error message */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm text-center mb-4"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-[#0054A6] to-[#003D7A] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Xác nhận
                            </button>
                        </form>

                        {/* Hint */}
                        <p className="text-xs text-gray-400 text-center mt-4">
                            Liên hệ Ban tổ chức nếu quên mật khẩu
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
