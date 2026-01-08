import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Prize {
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

interface SpinWheelProps {
    prizes: Prize[]
    onSpinStart?: () => void
    onSpinEnd?: (prize: Prize) => void
}

const SpinWheel = ({ prizes, onSpinStart, onSpinEnd }: SpinWheelProps) => {
    const [rotation, setRotation] = useState(0)
    const [isSpinning, setIsSpinning] = useState(false)
    const [wheelSize, setWheelSize] = useState(340)
    
    // Audio context for generating sounds
    const audioContextRef = useRef<AudioContext | null>(null)

    // Initialize audio context
    useEffect(() => {
        try {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass()
            }
        } catch (error) {
            console.log('AudioContext not supported:', error)
        }
    }, [])

    // Generate tick sound
    const playTickSound = () => {
        if (!audioContextRef.current) return
        const ctx = audioContextRef.current
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.1)
    }

    // Generate win sound
    const playWinSound = () => {
        if (!audioContextRef.current) return
        const ctx = audioContextRef.current
        
        // Play ascending notes
        const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator()
            const gainNode = ctx.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(ctx.destination)
            
            oscillator.frequency.value = freq
            oscillator.type = 'sine'
            
            const startTime = ctx.currentTime + (i * 0.15)
            gainNode.gain.setValueAtTime(0.2, startTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
            
            oscillator.start(startTime)
            oscillator.stop(startTime + 0.3)
        })
    }

    // Generate lose sound
    const playLoseSound = () => {
        if (!audioContextRef.current) return
        const ctx = audioContextRef.current
        
        // Simple "boop" sound - shorter and less harsh
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.value = 300
        oscillator.type = 'sine' // Changed to sine for softer sound
        
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.15)
    }

    // Responsive wheel size
    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth
            if (width < 380) {
                setWheelSize(280)
            } else if (width < 480) {
                setWheelSize(300)
            } else if (width < 640) {
                setWheelSize(320)
            } else {
                setWheelSize(360)
            }
        }
        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const segmentAngle = 360 / prizes.length
    const numLEDs = 24 // Number of LED lights around the wheel

    // Responsive icon size based on number of prizes
    const getResponsiveIconSize = () => {
        const numPrizes = prizes.length
        const baseSize = wheelSize < 320 ? 24 : 28
        
        // Giảm kích thước khi có nhiều ô hơn
        if (numPrizes > 12) return baseSize * 0.5  // 14px
        if (numPrizes > 10) return baseSize * 0.65 // 18px
        if (numPrizes > 8) return baseSize * 0.75  // 21px
        return baseSize // 28px
    }

    const iconFontSize = getResponsiveIconSize()

    // Generate SVG path for each segment
    const getSegmentPath = (index: number) => {
        const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
        const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
        const radius = wheelSize / 2 - 12
        const centerX = wheelSize / 2
        const centerY = wheelSize / 2

        const x1 = centerX + radius * Math.cos(startAngle)
        const y1 = centerY + radius * Math.sin(startAngle)
        const x2 = centerX + radius * Math.cos(endAngle)
        const y2 = centerY + radius * Math.sin(endAngle)

        const largeArc = segmentAngle > 180 ? 1 : 0

        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }

    // Get icon position (closer to edge, larger)
    const getIconPosition = (index: number) => {
        const angle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180)
        // Điều chỉnh radius dựa trên số lượng prizes
        const radiusOffset = prizes.length > 10 ? 0.18 : 0.22
        const radius = wheelSize / 2 - (wheelSize * radiusOffset)
        const centerX = wheelSize / 2
        const centerY = wheelSize / 2

        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            rotation: (index + 0.5) * segmentAngle,
        }
    }

    // Generate LED positions around the wheel
    const getLEDPositions = () => {
        const positions = []
        for (let i = 0; i < numLEDs; i++) {
            const angle = (i * (360 / numLEDs) - 90) * (Math.PI / 180)
            const radius = wheelSize / 2 + 2
            const centerX = wheelSize / 2
            const centerY = wheelSize / 2
            positions.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                index: i,
            })
        }
        return positions
    }

    const handleSpin = () => {
        if (isSpinning) return

        setIsSpinning(true)
        onSpinStart?.()

        // Play tick sound when spinning
        playTickSound()

        // Pick a random winner
        const winningIndex = Math.floor(Math.random() * prizes.length)
        const winner = prizes[winningIndex]

        // Calculate rotation
        const segmentAngle = 360 / prizes.length
        const spins = 5 + Math.floor(Math.random() * 3) // 5-7 full rotations

        // Normalize current rotation to 0-360 range
        const normalizedRotation = ((rotation % 360) + 360) % 360

        // Calculate the center angle of the winning segment
        // Segment 0 starts at top (0 degrees), each segment spans segmentAngle degrees clockwise
        const segmentCenterAngle = winningIndex * segmentAngle + segmentAngle / 2

        // Add random offset within segment for natural feel (not always dead center)
        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.5

        // When wheel rotates X degrees clockwise, a segment at angle A appears at angle (A + X)
        // We want segment at segmentCenterAngle to appear at 0 (top/pointer)
        // So: segmentCenterAngle + X ≡ 0 (mod 360)
        // Therefore: X = -segmentCenterAngle = 360 - segmentCenterAngle
        
        const targetAngle = segmentCenterAngle + randomOffset
        
        // Calculate how much more we need to rotate from current position
        // We need: normalizedRotation + additionalRotation ≡ (360 - targetAngle) (mod 360)
        let additionalRotation = (360 - targetAngle - normalizedRotation + 360) % 360
        
        // Ensure we always rotate forward (at least a small amount beyond full spins)
        if (additionalRotation < 30) {
            additionalRotation += 360
        }

        // Final rotation: current + full spins + additional rotation to land on prize
        const targetRotation = rotation + (spins * 360) + additionalRotation

        setRotation(targetRotation)

        setTimeout(() => {
            setIsSpinning(false)
            
            // Play win or lose sound based on prize type
            if (winner.isWin) {
                playWinSound()
            } else {
                playLoseSound()
            }
            
            onSpinEnd?.(winner)
        }, 5000)
    }

    const pointerSize = wheelSize < 320 ? 36 : 44
    const centerRadius = wheelSize < 320 ? 32 : 40

    return (
        <div className="flex flex-col items-center gap-3 sm:gap-5">
            {/* Wheel Container */}
            <div className="relative" style={{ width: wheelSize + 30, height: wheelSize + 50 }}>

                {/* Pointer - Premium Design */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <svg width={pointerSize} height={pointerSize * 1.3} viewBox="0 0 44 58">
                        {/* Pointer shadow */}
                        <defs>
                            <filter id="pointerShadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
                            </filter>
                            <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="50%" stopColor="#FFA500" />
                                <stop offset="100%" stopColor="#FF8C00" />
                            </linearGradient>
                        </defs>
                        <polygon
                            points="22,58 4,15 22,0 40,15"
                            fill="url(#pointerGradient)"
                            stroke="#fff"
                            strokeWidth="2"
                            filter="url(#pointerShadow)"
                        />
                        <circle cx="22" cy="16" r="6" fill="#fff" />
                        <circle cx="22" cy="16" r="3" fill="#FFD700" />
                    </svg>
                </div>

                {/* LED Lights Ring */}
                <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                        top: pointerSize * 0.75,
                        width: wheelSize + 20,
                        height: wheelSize + 20,
                    }}
                >
                    <svg width={wheelSize + 20} height={wheelSize + 20} viewBox={`0 0 ${wheelSize + 20} ${wheelSize + 20}`}>
                        {getLEDPositions().map((pos, i) => (
                            <motion.circle
                                key={i}
                                cx={pos.x + 10}
                                cy={pos.y + 10}
                                r={wheelSize < 320 ? 4 : 5}
                                fill={i % 2 === 0 ? '#FFD700' : '#FFFFFF'}
                                animate={isSpinning ? {
                                    opacity: [1, 0.3, 1],
                                    scale: [1, 0.8, 1],
                                } : {
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: isSpinning ? 0.2 : 1.5,
                                    repeat: Infinity,
                                    delay: i * (isSpinning ? 0.02 : 0.05),
                                }}
                                style={{
                                    filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))',
                                }}
                            />
                        ))}
                    </svg>
                </div>

                {/* Main Wheel */}
                <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                        top: pointerSize * 0.75 + 10,
                        width: wheelSize,
                        height: wheelSize,
                    }}
                >
                    {/* Outer Decorative Ring */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, #0054A6, #003D7A, #0054A6)',
                            padding: 4,
                            boxShadow: '0 10px 40px rgba(0,84,166,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                        }}
                    >
                        <div
                            className="w-full h-full rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700, #FFC000, #FFD700)',
                                padding: 4,
                            }}
                        >
                            <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden">
                                {/* Spinning SVG Wheel */}
                                <motion.svg
                                    width={wheelSize - 20}
                                    height={wheelSize - 20}
                                    viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                                    className="rounded-full"
                                    animate={{ rotate: rotation }}
                                    transition={{
                                        duration: 5,
                                        ease: [0.2, 0.8, 0.2, 1],
                                    }}
                                    style={{ transformOrigin: 'center center' }}
                                >
                                    {/* Gradient Definitions */}
                                    <defs>
                                        {prizes.map((prize, index) => (
                                            <linearGradient
                                                key={`grad-${prize.id}`}
                                                id={`segment-gradient-${index}`}
                                                x1="0%" y1="0%" x2="100%" y2="100%"
                                            >
                                                <stop offset="0%" stopColor={prize.color} />
                                                <stop offset="100%" stopColor={prize.colorEnd} />
                                            </linearGradient>
                                        ))}
                                        <filter id="innerShadow">
                                            <feOffset dx="0" dy="2" />
                                            <feGaussianBlur stdDeviation="2" result="offset-blur" />
                                            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                                            <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                                            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                                            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                                        </filter>
                                    </defs>

                                    {/* Segments with Gradients */}
                                    {prizes.map((prize, index) => (
                                        <path
                                            key={prize.id}
                                            d={getSegmentPath(index)}
                                            fill={`url(#segment-gradient-${index})`}
                                            stroke="#FFFFFF"
                                            strokeWidth="2"
                                            filter="url(#innerShadow)"
                                        />
                                    ))}

                                    {/* Icons/Images - Main Visual */}
                                    {prizes.map((prize, index) => {
                                        const pos = getIconPosition(index)

                                        // If prize has image, render it instead of emoji
                                        if (prize.image) {
                                            // Điều chỉnh size dựa trên số lượng prizes để tránh vỡ
                                            let imageMultiplier = 3.5
                                            if (prizes.length >= 7) imageMultiplier = 2.8
                                            if (prizes.length >= 10) imageMultiplier = 2.2
                                            
                                            const imageSize = iconFontSize * imageMultiplier
                                            const isSpecial = prize.isSpecial
                                            
                                            return (
                                                <foreignObject
                                                    key={`img-${prize.id}`}
                                                    x={pos.x - imageSize / 2}
                                                    y={pos.y - imageSize / 2}
                                                    width={imageSize}
                                                    height={imageSize}
                                                    transform={`rotate(${pos.rotation}, ${pos.x}, ${pos.y})`}
                                                >
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div 
                                                            className={isSpecial ? 'special-prize-border' : ''}
                                                            style={{
                                                                width: '90%',
                                                                height: '90%',
                                                                borderRadius: '50%',
                                                                padding: isSpecial ? '3px' : '0',
                                                                background: isSpecial ? 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)' : 'transparent',
                                                            }}
                                                        >
                                                            <img
                                                                src={prize.image}
                                                                alt={prize.label}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '50%',
                                                                    border: isSpecial ? '2px solid white' : '3px solid white',
                                                                    boxShadow: isSpecial 
                                                                        ? '0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,165,0,0.5)' 
                                                                        : '0 2px 8px rgba(0,0,0,0.2)',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </foreignObject>
                                            )
                                        }

                                        // Otherwise render emoji as before - CHỈ KHI KHÔNG CÓ HÌNH
                                        return (
                                            <text
                                                key={`icon-${prize.id}`}
                                                x={pos.x}
                                                y={pos.y}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize={iconFontSize}
                                                transform={`rotate(${pos.rotation}, ${pos.x}, ${pos.y})`}
                                            >
                                                {prize.icon}
                                            </text>
                                        )
                                    })}

                                    {/* Center Circle with Logo */}
                                    <circle
                                        cx={wheelSize / 2}
                                        cy={wheelSize / 2}
                                        r={centerRadius + 4}
                                        fill="url(#segment-gradient-0)"
                                        stroke="#FFD700"
                                        strokeWidth="3"
                                    />
                                    <circle
                                        cx={wheelSize / 2}
                                        cy={wheelSize / 2}
                                        r={centerRadius}
                                        fill="#fff"
                                        stroke="#0054A6"
                                        strokeWidth="2"
                                    />

                                    {/* VHU Text in Center */}
                                    <text
                                        x={wheelSize / 2}
                                        y={wheelSize / 2 - 4}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#0054A6"
                                        fontSize={wheelSize < 320 ? 14 : 18}
                                        fontWeight="900"
                                        fontFamily="'Be Vietnam Pro', sans-serif"
                                    >
                                        VHU
                                    </text>
                                    <text
                                        x={wheelSize / 2}
                                        y={wheelSize / 2 + 10}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#FFD700"
                                        fontSize={wheelSize < 320 ? 6 : 8}
                                        fontWeight="600"
                                        fontFamily="'Be Vietnam Pro', sans-serif"
                                    >
                                        ★ LUCKY ★
                                    </text>
                                </motion.svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Orange Gradient Spin Button */}
            <motion.button
                onClick={handleSpin}
                disabled={isSpinning}
                whileHover={{ scale: isSpinning ? 1 : 1.05 }}
                whileTap={{ scale: isSpinning ? 1 : 0.95 }}
                className="relative px-10 sm:px-14 py-3.5 sm:py-4 text-lg sm:text-xl font-black text-white rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                style={{
                    background: isSpinning
                        ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
                        : 'linear-gradient(135deg, #FF8C00, #FF6B00, #FF4500)',
                    boxShadow: isSpinning
                        ? '0 4px 15px rgba(0,0,0,0.2)'
                        : '0 6px 0 #CC3700, 0 10px 30px rgba(255,107,0,0.5)',
                    transform: isSpinning ? 'translateY(0)' : 'translateY(-2px)',
                }}
            >
                {/* Shine effect */}
                {!isSpinning && (
                    <motion.div
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                            x: ['-100%', '200%'],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                        }}
                    />
                )}
                <span className="relative z-10 drop-shadow-md">
                    {isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY!'}
                </span>
            </motion.button>
        </div>
    )
}

export default SpinWheel
