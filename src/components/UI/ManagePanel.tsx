import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, RotateCcw, Settings, Upload } from 'lucide-react'
import type { Prize } from '../../App'

interface ManagePanelProps {
    isOpen: boolean
    onClose: () => void
    prizes: Prize[]
    onUpdatePrizes: (prizes: Prize[]) => void
    onReset: () => void
}

export default function ManagePanel({
    isOpen,
    onClose,
    prizes,
    onUpdatePrizes,
    onReset,
}: ManagePanelProps) {
    const [editingPrizes, setEditingPrizes] = useState(prizes)

    // Sync editingPrizes when panel opens or prizes change
    useEffect(() => {
        if (isOpen) {
            setEditingPrizes(prizes)
        }
    }, [isOpen, prizes])

    const handleQuantityChange = (id: string, delta: number) => {
        setEditingPrizes(prev =>
            prev.map(p =>
                p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
            )
        )
    }

    const handleLabelChange = (id: string, label: string) => {
        setEditingPrizes(prev =>
            prev.map(p => (p.id === id ? { ...p, label } : p))
        )
    }

    const handleImageChange = (id: string, file: File | null) => {
        if (!file) return

        // Read file as base64 for localStorage
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            setEditingPrizes(prev =>
                prev.map(p => (p.id === id ? { ...p, image: base64String } : p))
            )
        }
        reader.readAsDataURL(file)
    }

    const handleSave = () => {
        onUpdatePrizes(editingPrizes)
        onClose()
    }

    const handleCancel = () => {
        setEditingPrizes(prizes)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCancel}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] md:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#0054A6] to-[#003D7A]">
                            <div className="flex items-center gap-2 text-white">
                                <Settings className="w-5 h-5" />
                                <h2 className="text-lg font-bold">Quản Lý Phần Quà</h2>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Prize List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {editingPrizes.map(prize => (
                                <div
                                    key={prize.id}
                                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#0054A6] transition-colors"
                                >
                                    {/* Prize Header */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{prize.icon}</span>
                                        <input
                                            type="text"
                                            value={prize.label}
                                            onChange={e => handleLabelChange(prize.id, e.target.value)}
                                            className="flex-1 px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#0054A6] rounded"
                                        />
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Số lượng:</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(prize.id, -1)}
                                                className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50"
                                                disabled={prize.quantity === 0}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="min-w-[40px] text-center font-bold text-lg">
                                                {prize.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(prize.id, 1)}
                                                className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Prize Type Badge */}
                                    <div className="mt-2 flex items-center justify-between">
                                        <span
                                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${prize.isWin
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {prize.isWin ? '🎁 Phần quà' : '🔄 Thử lại'}
                                        </span>

                                        {/* Image Upload */}
                                        <label className="cursor-pointer flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded transition-colors">
                                            <Upload className="w-3 h-3" />
                                            {prize.image ? 'Đổi ảnh' : 'Thêm ảnh'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleImageChange(prize.id, e.target.files?.[0] || null)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Image Preview */}
                                    {prize.image && (
                                        <div className="mt-2 relative">
                                            <img
                                                src={prize.image}
                                                alt={prize.label}
                                                className="w-full h-20 object-cover rounded border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
                            <button
                                onClick={onReset}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Khôi phục mặc định
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0054A6] to-[#003D7A] hover:opacity-90 text-white font-medium rounded-lg transition-opacity shadow-md"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
