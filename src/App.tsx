import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import SpinWheel from './components/Wheel/SpinWheel'
import ResultModal from './components/UI/ResultModal'
import ManagePanel from './components/UI/ManagePanel'
import ManagerButton from './components/UI/ManagerButton'

// Import images from assets
import gauImg from './assets/gau.jpg'
import baloImg from './assets/balo.jpg'
import binhNuocImg from './assets/binhnuoc.jpg'
import nonImg from './assets/non.jpg'
import mocKhoaImg from './assets/mockhoa.jpg'
import nguaImg from './assets/ngua.jpg'
import sadIcon from './assets/icon-sad.png'

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
  isSpecial?: boolean
}

// Default VHU-Themed Prizes with Images
const DEFAULT_PRIZES: Prize[] = [
  { id: '1', label: 'Gấu VHU', icon: '', color: '#0054A6', colorEnd: '#003D7A', isWin: true, quantity: 5, image: gauImg, isSpecial: true },
  { id: '3', label: 'Balo VHU', icon: '', color: '#FFD700', colorEnd: '#D4AF37', isWin: true, quantity: 5, image: baloImg },
  { id: '2', label: 'Chúc may mắn lần sau', icon: '', color: '#64748B', colorEnd: '#475569', isWin: false, quantity: 5, image: sadIcon },
  { id: '4', label: 'Bình Nước', icon: '', color: '#E31837', colorEnd: '#B91C3C', isWin: true, quantity: 5, image: binhNuocImg },
  { id: '6', label: 'Nón BH', icon: '', color: '#10B981', colorEnd: '#059669', isWin: true, quantity: 3, image: nonImg },
  { id: '5', label: 'Chúc may mắn lần sau', icon: '', color: '#475569', colorEnd: '#334155', isWin: false, quantity: 5, image: sadIcon },
  { id: '7', label: 'Móc Khóa VHU', icon: '', color: '#F59E0B', colorEnd: '#D97706', isWin: true, quantity: 3, image: mocKhoaImg },
  { id: '9', label: 'Kì Lân VHU', icon: '', color: '#8B5CF6', colorEnd: '#7C3AED', isWin: true, quantity: 3, image: nguaImg },
  { id: '8', label: 'Chúc may mắn lần sau', icon: '', color: '#334155', colorEnd: '#1E293B', isWin: false, quantity: 5, image: sadIcon },
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
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  
  // Audio refs
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const spinningMusicRef = useRef<HTMLAudioElement | null>(null)
  
  // Background music enabled state
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('vhu_music_enabled')
    return saved !== null ? JSON.parse(saved) : true
  })
  
  const [prizes, setPrizes] = useState<Prize[]>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const loadedPrizes = JSON.parse(saved)
        
        // Kiểm tra xem số lượng prizes có khớp với DEFAULT không
        // Nếu khác nhau (thêm/bớt prizes) → Reset về DEFAULT
        const defaultIds = DEFAULT_PRIZES.map(p => p.id).sort()
        const loadedIds = loadedPrizes.map((p: Prize) => p.id).sort()
        const idsMatch = JSON.stringify(defaultIds) === JSON.stringify(loadedIds)
        
        if (!idsMatch) {
          // Số lượng/ID khác nhau → Reset về DEFAULT
          console.log('Prizes structure changed, resetting to defaults')
          return DEFAULT_PRIZES
        }
        
        // Nếu số lượng khớp, kiểm tra xem có prize nào thiếu image không
        const needsMigration = loadedPrizes.some((p: Prize) => {
          const defaultPrize = DEFAULT_PRIZES.find(dp => dp.id === p.id)
          return defaultPrize && defaultPrize.image && !p.image
        })
        
        // Migrate images từ DEFAULT nếu cần
        if (needsMigration) {
          const migratedPrizes = loadedPrizes.map((p: Prize) => {
            const defaultPrize = DEFAULT_PRIZES.find(dp => dp.id === p.id)
            if (defaultPrize && defaultPrize.image && !p.image) {
              return { ...p, image: defaultPrize.image }
            }
            return p
          })
          return migratedPrizes
        }
        
        return loadedPrizes
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

  // Save music enabled state to localStorage
  useEffect(() => {
    localStorage.setItem('vhu_music_enabled', JSON.stringify(isMusicEnabled))
  }, [isMusicEnabled])

  // Initialize and play background music
  useEffect(() => {
    // Initialize background music
    const bgMusic = new Audio('/sounds/happy-sound.mp3')
    bgMusic.loop = true
    bgMusic.volume = 0.3
    backgroundMusicRef.current = bgMusic

    // Initialize spinning music
    const spinMusic = new Audio('/sounds/sound-spinning.mp3')
    spinMusic.loop = true
    spinMusic.volume = 0.5
    spinningMusicRef.current = spinMusic

    // Play background music on user interaction if enabled
    const playBgMusic = () => {
      if (isMusicEnabled) {
        bgMusic.play().catch(err => console.log('Background music play failed:', err))
      }
      // Remove listener after first interaction
      document.removeEventListener('click', playBgMusic)
    }
    document.addEventListener('click', playBgMusic)

    return () => {
      bgMusic.pause()
      spinMusic.pause()
      document.removeEventListener('click', playBgMusic)
    }
  }, [isMusicEnabled])

  // Handle music toggle
  useEffect(() => {
    if (backgroundMusicRef.current) {
      if (isMusicEnabled && !isSpinning) {
        backgroundMusicRef.current.play().catch(err => console.log('Background music play failed:', err))
      } else if (!isMusicEnabled) {
        backgroundMusicRef.current.pause()
      }
    }
  }, [isMusicEnabled, isSpinning])

  // Filter prizes with quantity > 0
  const filteredPrizes = prizes.filter(prize => prize.quantity > 0)

  // Check if all real prizes are sold out
  const allRealPrizesSoldOut = prizes
    .filter(p => p.isWin)
    .every(p => p.quantity === 0)

  const handleSpinStart = () => {
    setIsSpinning(true)
    
    // Fade out background music and play spinning music
    if (backgroundMusicRef.current) {
      const fadeOut = setInterval(() => {
        if (backgroundMusicRef.current && backgroundMusicRef.current.volume > 0.05) {
          backgroundMusicRef.current.volume -= 0.05
        } else {
          if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause()
            backgroundMusicRef.current.volume = 0.3
          }
          clearInterval(fadeOut)
        }
      }, 50)
    }
    
    // Play spinning music
    if (spinningMusicRef.current) {
      spinningMusicRef.current.currentTime = 0
      spinningMusicRef.current.play().catch(err => console.log('Spinning music play failed:', err))
    }
  }

  const handleSpinEnd = (winner: Prize) => {
    setResult(winner)
    setIsSpinning(false)

    // Stop spinning music
    if (spinningMusicRef.current) {
      spinningMusicRef.current.pause()
      spinningMusicRef.current.currentTime = 0
    }

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
    
    // Resume background music after closing modal if enabled
    if (backgroundMusicRef.current && isMusicEnabled) {
      backgroundMusicRef.current.volume = 0.3
      backgroundMusicRef.current.play().catch(err => console.log('Background music resume failed:', err))
    }
  }

  const handleToggleMusic = () => {
    setIsMusicEnabled(prev => !prev)
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
      // Open panel and let it handle password check
      setIsPanelOpen(true)
    }
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-3 sm:px-4 pt-6 sm:pt-8 pb-4 sm:pb-6">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 sm:mb-3"
        >
          <img
            src="/logo.png"
            alt="VHU Logo"
            className="h-14 sm:h-20 md:h-24 w-auto object-contain"
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
          className="text-center mb-2 sm:mb-4"
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
              key={prizes.length} // Force re-render when prizes change
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
        isMusicEnabled={isMusicEnabled}
        onToggleMusic={handleToggleMusic}
      />

      {/* Manager Button (Always visible for organizers) */}
      <ManagerButton onClick={handleManagerClick} />
    </div>
  )
}

export default App
