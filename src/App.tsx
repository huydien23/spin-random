import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SpinWheel from './components/Wheel/SpinWheel'
import ResultModal from './components/UI/ResultModal'
import ManagePanel from './components/UI/ManagePanel'
import ManagerButton from './components/UI/ManagerButton'
import PasswordModal from './components/UI/PasswordModal'

// Prize Interface
export interface Prize {
  id: string
  label: string
  icon: string
  color: string
  colorEnd: string
  isWin: boolean
  quantity: number
  image?: string
}

// Default VHU-Themed Prizes
const DEFAULT_PRIZES: Prize[] = [
  { id: '1', label: 'Gấu VHU', icon: '🧸', color: '#0054A6', colorEnd: '#003D7A', isWin: true, quantity: 5 },
  { id: '2', label: 'Balo VHU', icon: '🎒', color: '#FFD700', colorEnd: '#D4AF37', isWin: true, quantity: 5 },
  { id: '3', label: 'Thử Lại', icon: '🔄', color: '#E31837', colorEnd: '#B91C3C', isWin: false, quantity: 999 },
  { id: '4', label: 'Bình Nước', icon: '🍶', color: '#0054A6', colorEnd: '#003D7A', isWin: true, quantity: 5 },
  { id: '5', label: 'Nón BH', icon: '⛑️', color: '#FFD700', colorEnd: '#D4AF37', isWin: true, quantity: 3 },
  { id: '6', label: 'May Mắn', icon: '🍀', color: '#E31837', colorEnd: '#B91C3C', isWin: false, quantity: 999 },
  { id: '7', label: 'Móc Khoá', icon: '🔑', color: '#0054A6', colorEnd: '#003D7A', isWin: true, quantity: 10 },
  { id: '8', label: 'Áo VHU', icon: '👕', color: '#FFD700', colorEnd: '#D4AF37', isWin: true, quantity: 3 },
]

// LocalStorage key
const STORAGE_KEY = 'vhu_spin_prizes'

// Floating decorations
const FloatingIcons = () => {
  const icons = ['🎓', '📚', '✏️', '🎉', '⭐', '🏆']
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl sm:text-3xl opacity-10"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  )
}

function App() {
  const [result, setResult] = useState<Prize | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [prizes, setPrizes] = useState<Prize[]>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return DEFAULT_PRIZES
      }
    }
    return DEFAULT_PRIZES
  })

  // Save to localStorage whenever prizes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prizes))
  }, [prizes])

  // Filter prizes with quantity > 0
  const filteredPrizes = prizes.filter(prize => prize.quantity > 0)

  // Check if all real prizes are sold out
  const allRealPrizesSoldOut = prizes
    .filter(p => p.isWin)
    .every(p => p.quantity === 0)

  const handleSpinStart = () => {
    setIsSpinning(true)
  }

  const handleSpinEnd = (winner: Prize) => {
    setIsSpinning(false)
    setResult(winner)

    // Decrement quantity if it's a real prize
    if (winner.isWin && winner.quantity > 0) {
      setPrizes(prev => prev.map(p =>
        p.id === winner.id
          ? { ...p, quantity: Math.max(0, p.quantity - 1) }
          : p
      ))
    }

    setTimeout(() => {
      setIsModalOpen(true)
    }, 500)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setResult(null)
  }

  const handleResetPrizes = () => {
    if (confirm('Bạn có chắc muốn khôi phục lại số lượng mặc định?')) {
      setPrizes(DEFAULT_PRIZES)
      setIsPanelOpen(false)
    }
  }

  // Handle manager button click - check authentication
  const handleManagerClick = () => {
    const isAuthenticated = sessionStorage.getItem('vhu_admin_authenticated') === 'true'
    if (isAuthenticated) {
      setIsPanelOpen(true)
    } else {
      setIsPasswordModalOpen(true)
    }
  }

  // Handle successful password authentication
  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false)
    setIsPanelOpen(true)
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background with Spotlight Effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 50%),
            linear-gradient(135deg, 
              rgba(248,250,252,1) 0%, 
              rgba(219,234,254,0.8) 30%, 
              rgba(191,219,254,0.6) 60%, 
              rgba(147,197,253,0.5) 100%
            )
          `,
        }}
      />

      {/* Floating Decorations */}
      <FloatingIcons />

      {/* Confetti Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230054A6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 sm:mb-4"
        >
          <img
            src="/logo.png"
            alt="VHU Logo"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          />
        </motion.div>

        {/* Title - Bigger & Bolder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4 sm:mb-6"
        >
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0054A6] mb-1 tracking-tight"
            style={{
              textShadow: '2px 2px 0 rgba(255,215,0,0.3)',
            }}
          >
            🎁 VÒNG QUAY MAY MẮN 🎁
          </h1>
          <p className="text-[#0054A6]/70 text-sm sm:text-base font-medium">
            Quay và nhận quà ngay!
          </p>
        </motion.div>

        {/* Wheel with Spotlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Spotlight glow behind wheel */}
          <div
            className="absolute inset-0 -m-10 rounded-full blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
            }}
          />
          {/* Conditional Rendering: Sold Out State or Active Wheel */}
          {allRealPrizesSoldOut ? (
            // Sold Out State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 px-6"
            >
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0054A6] mb-2">
                Đã Hết Quà!
              </h2>
              <p className="text-gray-600 mb-6">
                Cảm ơn bạn đã tham gia. Mọi phần quà đã được trao hết.
              </p>
              <div className="text-sm text-gray-500">
                <p className="italic">
                  "Thành Nhân trước thành Danh"
                </p>
                <p className="font-semibold text-[#FFD700] mt-1">
                  - Trường Đại học Văn Hiến -
                </p>
              </div>
            </motion.div>
          ) : (
            // Active Wheel
            <SpinWheel
              prizes={filteredPrizes}
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd}
            />
          )}
        </motion.div>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={isModalOpen}
        prize={result}
        onClose={handleCloseModal}
      />

      {/* Management Panel (Admin Only) */}
      <ManagePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        prizes={prizes}
        onUpdatePrizes={setPrizes}
        onReset={handleResetPrizes}
      />

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* Manager Button (Always visible for organizers) */}
      <ManagerButton onClick={handleManagerClick} />
    </div>
  )
}

export default App
