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
    isSpecial?: boolean
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
                            recycle={prize.isSpecial}
                            numberOfPieces={prize.isSpecial ? 150 : 500}
                            colors={prize.isSpecial
                                ? ['#FFD700', '#FFA500', '#FF6B6B', '#E85D5D', '#FFFFFF']
                                : ['#FFD700', '#0054A6', '#FF8C00', '#FFFFFF', '#FF6B6B', '#4ECDC4']
                            }
                            gravity={prize.isSpecial ? 0.15 : 0.4}
                            initialVelocityX={prize.isSpecial ? 8 : 15}
                            initialVelocityY={prize.isSpecial ? 15 : 30}
                            tweenDuration={100}
                            confettiSource={{ x: windowSize.width / 2, y: windowSize.height / 3, w: 0, h: 0 }}
                        />
                    )}

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Special Prize Outer Glow Ring */}
                        {prize.isSpecial && (
                            <motion.div
                                className="absolute -inset-2 rounded-[28px] opacity-60"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B6B, #FFD700)',
                                    filter: 'blur(8px)',
                                }}
                                animate={{
                                    opacity: [0.4, 0.7, 0.4],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        )}

                        <div
                            className={`relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 lg:p-14 max-w-[90vw] sm:max-w-md md:max-w-xl lg:max-w-2xl w-full text-center overflow-hidden ${prize.isSpecial ? 'ring-2 ring-orange-400' : ''
                                }`}
                        >
                            {/* Special Prize Top Banner */}
                            {prize.isSpecial && (
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                    className="absolute top-0 left-0 right-0 py-2 text-center text-white text-xs font-bold tracking-wider"
                                    style={{
                                        background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6B6B)',
                                    }}
                                >
                                    ★ GIẢI ĐẶC BIỆT ★
                                </motion.div>
                            )}

                            {/* Decorative background circles */}
                            <div
                                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                                style={{
                                    background: prize.isSpecial
                                        ? 'linear-gradient(45deg, #FFD700, #FFA500)'
                                        : prize.color
                                }}
                            />
                            <div
                                className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-10"
                                style={{
                                    background: prize.isSpecial
                                        ? 'linear-gradient(45deg, #FF6B6B, #FFD700)'
                                        : '#FFD700'
                                }}
                            />

                            {/* Prize Icon/Image */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.15 }}
                                className={`relative z-10 mx-auto mb-3 sm:mb-4 ${prize.isSpecial ? 'mt-6' : ''}`}
                            >
                                {/* Special Prize Glow behind image */}
                                {prize.isSpecial && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
                                            transform: 'scale(1.5)',
                                        }}
                                        animate={{
                                            opacity: [0.5, 1, 0.5],
                                            scale: [1.4, 1.6, 1.4],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                )}

                                <div
                                    className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto rounded-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl overflow-hidden ${prize.isSpecial ? 'ring-4 ring-orange-400 ring-offset-2' : ''
                                        }`}
                                    style={{
                                        background: prize.isSpecial
                                            ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                            : prize.isWin
                                                ? `linear-gradient(135deg, ${prize.color}, ${prize.colorEnd})`
                                                : 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                                        boxShadow: prize.isSpecial
                                            ? '0 8px 30px rgba(255,165,0,0.5)'
                                            : prize.isWin
                                                ? `0 8px 25px ${prize.color}40`
                                                : '0 4px 15px rgba(0,0,0,0.1)',
                                        padding: prize.isSpecial ? '4px' : '0',
                                    }}
                                >
                                    <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${prize.isSpecial ? 'bg-white' : ''}`}>
                                        {prize.image ? (
                                            <img
                                                src={prize.image}
                                                alt={prize.label}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{prize.icon}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-3 ${prize.isSpecial
                                    ? 'text-transparent bg-clip-text'
                                    : prize.isWin
                                        ? 'text-[#0054A6]'
                                        : 'text-gray-500'
                                    }`}
                                style={prize.isSpecial ? {
                                    background: 'linear-gradient(90deg, #FF6B6B, #FFA500, #FFD700)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                } : {}}
                            >
                                {prize.isSpecial
                                    ? 'Siêu May Mắn!'
                                    : prize.isWin
                                        ? 'Chúc mừng!'
                                        : 'Chưa may mắn'}
                            </motion.h2>

                            {/* Subtitle */}
                            {(prize.isSpecial || prize.isWin) && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className={`text-base md:text-lg lg:text-xl mb-3 md:mb-4 ${prize.isSpecial ? 'text-orange-500 font-medium' : 'text-gray-500'}`}
                                >
                                    {prize.isSpecial
                                        ? 'Bạn đã trúng phần quà đặc biệt:'
                                        : 'Bạn đã trúng phần quà:'}
                                </motion.p>
                            )}

                            {/* Prize Name */}
                            <motion.p
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.45 }}
                                className={`font-black mb-6 sm:mb-8 md:mb-10 ${prize.isSpecial
                                    ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
                                    : prize.isWin
                                        ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
                                        : 'text-lg sm:text-xl md:text-2xl max-w-xs mx-auto'
                                    }`}
                                style={{
                                    background: prize.isSpecial
                                        ? 'linear-gradient(135deg, #FF6B6B, #FFA500, #FFD700)'
                                        : prize.isWin
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
                                transition={{ delay: 0.55 }}
                                onClick={onClose}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative w-full py-4 md:py-5 lg:py-6 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl lg:text-2xl text-white transition-all overflow-hidden"
                                style={{
                                    background: prize.isSpecial
                                        ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B6B)'
                                        : prize.isWin
                                            ? 'linear-gradient(135deg, #FF8C00, #FF6B00, #FF4500)'
                                            : 'linear-gradient(135deg, #0054A6, #003D7A)',
                                    boxShadow: prize.isSpecial
                                        ? '0 4px 0 #CC8800, 0 8px 25px rgba(255,165,0,0.4)'
                                        : prize.isWin
                                            ? '0 4px 0 #CC3700, 0 6px 20px rgba(255,107,0,0.4)'
                                            : '0 4px 0 #002D5A, 0 6px 15px rgba(0,84,166,0.3)',
                                }}
                            >
                                {prize.isWin ? 'Nhận quà tại quầy' : 'Quay lại'}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ResultModal
