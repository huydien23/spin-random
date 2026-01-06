import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'

interface Prize {
    id: string
    label: string
    icon: string
    color: string
    colorEnd: string
    image?: string
    isWin: boolean
    quantity: number
}

interface ResultModalProps {
    isOpen: boolean
    prize: Prize | null
    onClose: () => void
}

const ResultModal = ({ isOpen, prize, onClose }: ResultModalProps) => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <AnimatePresence>
            {isOpen && prize && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    {prize.isWin && (
                        <Confetti
                            width={windowSize.width}
                            height={windowSize.height}
                            recycle={false}
                            numberOfPieces={500}
                            colors={['#FFD700', '#0054A6', '#FF8C00', '#FFFFFF', '#FF6B6B', '#4ECDC4']}
                            gravity={0.4}
                            initialVelocityX={15}
                            initialVelocityY={30}
                            tweenDuration={100}
                            confettiSource={{ x: windowSize.width / 2, y: windowSize.height / 3, w: 0, h: 0 }}
                        />
                    )}

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-[90vw] sm:max-w-sm w-full text-center relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative background circles */}
                        <div
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                            style={{ background: prize.color }}
                        />
                        <div
                            className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-10"
                            style={{ background: '#FFD700' }}
                        />

                        {/* Prize Icon/Image - Large and Prominent */}
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center text-4xl sm:text-5xl mb-3 sm:mb-4 overflow-hidden"
                            style={{
                                background: prize.isWin
                                    ? `linear-gradient(135deg, ${prize.color}, ${prize.colorEnd})`
                                    : 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                                boxShadow: prize.isWin
                                    ? `0 8px 25px ${prize.color}40`
                                    : '0 4px 15px rgba(0,0,0,0.1)',
                            }}
                        >
                            {prize.image ? (
                                <img
                                    src={prize.image}
                                    alt={prize.label}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{prize.icon}</span>
                            )}
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-xl sm:text-2xl font-black mb-1 ${prize.isWin ? 'text-[#0054A6]' : 'text-gray-500'}`}
                        >
                            {prize.isWin ? '🎊 Chúc mừng! 🎊' : 'Chưa may mắn'}
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-500 text-sm mb-2"
                        >
                            {prize.isWin ? 'Bạn đã trúng phần quà:' : 'Hãy thử lại nhé!'}
                        </motion.p>

                        {/* Prize Name */}
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl sm:text-3xl font-black mb-5 sm:mb-6"
                            style={{
                                background: prize.isWin
                                    ? `linear-gradient(135deg, ${prize.color}, #FFD700)`
                                    : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {prize.label}
                        </motion.p>

                        {/* CTA Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onClose}
                            className="relative w-full py-3.5 rounded-xl font-bold text-white transition-all overflow-hidden"
                            style={{
                                background: prize.isWin
                                    ? 'linear-gradient(135deg, #FF8C00, #FF6B00, #FF4500)'
                                    : 'linear-gradient(135deg, #0054A6, #003D7A)',
                                boxShadow: prize.isWin
                                    ? '0 4px 0 #CC3700, 0 6px 20px rgba(255,107,0,0.4)'
                                    : '0 4px 0 #002D5A, 0 6px 15px rgba(0,84,166,0.3)',
                            }}
                        >
                            {prize.isWin ? '🎁 Nhận quà tại quầy' : '🔄 Quay lại'}
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ResultModal
