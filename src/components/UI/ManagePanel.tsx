import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, RotateCcw, Settings, Upload, Trash2, PlusCircle, Star, Volume2, VolumeX } from 'lucide-react'
import type { Prize } from '../../App'
import ConfirmModal from './ConfirmModal'
import Toast from './Toast'
import type { ToastType } from './Toast'

interface ManagePanelProps {
    isOpen: boolean
    onClose: () => void
    prizes: Prize[]
    onUpdatePrizes: (prizes: Prize[]) => void
    onReset: () => void
    isMusicEnabled: boolean
    onToggleMusic: () => void
}

export default function ManagePanel({
    isOpen,
    onClose,
    prizes,
    onUpdatePrizes,
    onReset,
    isMusicEnabled,
    onToggleMusic,
}: ManagePanelProps) {
    const [editingPrizes, setEditingPrizes] = useState(prizes)
    const [selectedPrizeIds, setSelectedPrizeIds] = useState<string[]>([])
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; prizeId: string | null; prizeName: string }>({
        isOpen: false,
        prizeId: null,
        prizeName: ''
    })
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
    const [confirmReset, setConfirmReset] = useState(false)
    const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
        isOpen: false,
        message: '',
        type: 'success'
    })

    // Sync editingPrizes when panel opens or prizes change
    useEffect(() => {
        if (isOpen) {
            setEditingPrizes(prizes)
            setSelectedPrizeIds([]) // Clear selections when opening
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const handleQuantityChange = (id: string, delta: number) => {
        setEditingPrizes(prev =>
            prev.map(p =>
                p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
            )
        )
    }

    const handleDirectQuantityChange = (id: string, value: string) => {
        const numValue = parseInt(value, 10)
        // Chỉ update nếu là số hợp lệ và >= 0
        if (!isNaN(numValue) && numValue >= 0) {
            setEditingPrizes(prev =>
                prev.map(p => p.id === id ? { ...p, quantity: numValue } : p)
            )
        }
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
        showToast('Đã lưu thay đổi thành công!', 'success')
        onClose()
    }

    const handleCancel = () => {
        setEditingPrizes(prizes)
        setSelectedPrizeIds([])
        onClose()
    }

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ isOpen: true, message, type })
    }

    const handleAddPrize = () => {
        // Giới hạn tối đa 12 ô để giao diện đẹp
        if (editingPrizes.length >= 12) {
            showToast('Chỉ nên có tối đa 12 ô để vòng quay đẹp mắt!', 'warning')
            return
        }

        const colors = [
            { color: '#0054A6', colorEnd: '#003D7A' },
            { color: '#FFD700', colorEnd: '#D4AF37' },
            { color: '#E31837', colorEnd: '#B91C3C' },
            { color: '#00B140', colorEnd: '#007A2E' },
            { color: '#FF6B00', colorEnd: '#CC5500' },
            { color: '#9B59B6', colorEnd: '#8E44AD' }
        ]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]

        const newPrize: Prize = {
            id: `prize-${Date.now()}`,
            label: `Phần quà ${editingPrizes.length + 1}`,
            icon: '',
            quantity: 1,
            isWin: true,
            ...randomColor
        }

        // Thêm ô mới vào đầu danh sách thay vì cuối
        setEditingPrizes(prev => [newPrize, ...prev])
        showToast('Đã thêm ô mới! Nhớ nhấn "Lưu" để áp dụng.', 'info')
    }

    const handleDeletePrize = (id: string) => {
        if (editingPrizes.length <= 4) {
            showToast('Phải có ít nhất 4 ô! ', 'warning')
            return
        }

        const prizeToDelete = editingPrizes.find(p => p.id === id)
        if (prizeToDelete) {
            setConfirmDelete({
                isOpen: true,
                prizeId: id,
                prizeName: prizeToDelete.label
            })
        }
    }

    const confirmDeletePrize = () => {
        if (confirmDelete.prizeId) {
            setEditingPrizes(prev => prev.filter(p => p.id !== confirmDelete.prizeId))
            showToast('Đã xóa ô. Nhớ nhấn "Lưu" để áp dụng.', 'success')
        }
    }

    const confirmResetPrizes = () => {
        onReset()
        showToast('Đã khôi phục về cài đặt mặc định!', 'success')
    }

    const toggleSelectPrize = (prizeId: string) => {
        setSelectedPrizeIds(prev =>
            prev.includes(prizeId)
                ? prev.filter(id => id !== prizeId)
                : [...prev, prizeId]
        )
    }

    const toggleSelectAll = () => {
        if (selectedPrizeIds.length === editingPrizes.length) {
            setSelectedPrizeIds([])
        } else {
            setSelectedPrizeIds(editingPrizes.map(p => p.id))
        }
    }

    const handleBulkDelete = () => {
        if (selectedPrizeIds.length === 0) {
            showToast('Chưa chọn ô nào để xóa!', 'warning')
            return
        }

        setConfirmBulkDelete(true)
    }

    const confirmBulkDeletePrizes = () => {
        const filtered = editingPrizes.filter(p => !selectedPrizeIds.includes(p.id))
        setEditingPrizes(filtered)
        showToast(`Đã xóa ${selectedPrizeIds.length} ô. Nhớ nhấn "Lưu" để áp dụng.`, 'success')
        setSelectedPrizeIds([])
    }

    const handleIsWinToggle = (id: string) => {
        setEditingPrizes(prev =>
            prev.map(p => (p.id === id ? { ...p, isWin: !p.isWin } : p))
        )
    }

    const handleSpecialToggle = (id: string) => {
        setEditingPrizes(prev =>
            prev.map(p => ({
                ...p,
                isSpecial: p.id === id ? !p.isSpecial : false // Chỉ 1 món đặc biệt
            }))
        )
        const prize = editingPrizes.find(p => p.id === id)
        if (prize && !prize.isSpecial) {
            showToast(`"${prize.label}" đã được đặt là Phần Quà Đặc Biệt!`, 'success')
        }
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCancel}
                            className="fixed inset-0 bg-black/50 z-40"
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
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-[#0054A6] to-[#003D7A]">
                                <div className="flex items-center gap-2 text-white">
                                    <Settings className="w-5 h-5" />
                                    <h2 className="text-lg font-bold">Quản Lý Phần Quà</h2>
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-white/20 rounded-full">
                                        {editingPrizes.length} ô
                                    </span>
                                    {selectedPrizeIds.length > 0 && (
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500 rounded-full">
                                            {selectedPrizeIds.length} đã chọn
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onToggleMusic}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                        title={isMusicEnabled ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
                                    >
                                        {isMusicEnabled ? (
                                            <Volume2 className="w-5 h-5 text-white" />
                                        ) : (
                                            <VolumeX className="w-5 h-5 text-white" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Warning Badge */}
                            {editingPrizes.length > 10 && (
                                <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                                    <span className="text-yellow-600 text-lg">⚠️</span>
                                    <div className="flex-1">
                                        <p className="text-sm text-yellow-800 font-semibold">Cảnh báo: Quá nhiều ô!</p>
                                        <p className="text-xs text-yellow-700 mt-0.5">
                                            Khuyến nghị tối đa 10-12 ô để giao diện vòng quay đẹp mắt.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Add New Prize Button */}
                            <div className="p-4 border-b border-gray-200 space-y-2">
                                <button
                                    onClick={handleAddPrize}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span>Thêm Ô Mới</span>
                                </button>

                                {/* Bulk Actions */}
                                {editingPrizes.length > 0 && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={toggleSelectAll}
                                            className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors"
                                        >
                                            {selectedPrizeIds.length === editingPrizes.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                        </button>
                                        {selectedPrizeIds.length > 0 && (
                                            <button
                                                onClick={handleBulkDelete}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Xóa ({selectedPrizeIds.length})
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Prize List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {editingPrizes.map(prize => (
                                    <div
                                        key={prize.id}
                                        className={`rounded-lg p-3 border-2 transition-all relative ${prize.isSpecial
                                            ? 'border-orange-300 bg-orange-50'
                                            : selectedPrizeIds.includes(prize.id)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 bg-gray-50 hover:border-[#0054A6]'
                                            }`}
                                    >
                                        {/* Special Badge */}
                                        {prize.isSpecial && (
                                            <div className="absolute -top-1.5 -right-1.5 z-20">
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-400 rounded-full shadow">
                                                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                                                </span>
                                            </div>
                                        )}

                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={selectedPrizeIds.includes(prize.id)}
                                            onChange={() => toggleSelectPrize(prize.id)}
                                            className="absolute top-3 left-3 w-5 h-5 cursor-pointer accent-blue-600"
                                        />

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeletePrize(prize.id)}
                                            className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors z-10"
                                            title="Xóa ô này"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Prize Header */}
                                        <div className="flex items-center gap-3 mb-2 pr-8 pl-8">
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
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={prize.quantity}
                                                    onChange={(e) => handleDirectQuantityChange(prize.id, e.target.value)}
                                                    onFocus={(e) => e.target.select()}
                                                    className="min-w-[60px] text-center font-bold text-lg border-2 border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-[#0054A6] transition-colors"
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(prize.id, 1)}
                                                    className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* IsWin Toggle */}
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={prize.isWin}
                                                    onChange={() => handleIsWinToggle(prize.id)}
                                                    className="w-4 h-4 accent-green-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    Trừ số lượng khi trúng
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ({prize.isWin ? 'Phần quà thật' : 'Vô hạn'})
                                                </span>
                                            </label>
                                        </div>

                                        {/* Image Upload */}
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-[#0054A6] transition-colors">
                                                <Upload className="w-4 h-4" />
                                                <span>Tải hình ảnh</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => handleImageChange(prize.id, e.target.files?.[0] || null)}
                                                    className="hidden"
                                                />
                                            </label>
                                            {prize.image && (
                                                <div className="mt-2">
                                                    <img
                                                        src={prize.image}
                                                        alt={prize.label}
                                                        className="w-full h-20 object-cover rounded border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Special Toggle */}
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => handleSpecialToggle(prize.id)}
                                                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${prize.isSpecial
                                                    ? 'bg-orange-400 text-white'
                                                    : 'bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600'
                                                    }`}
                                            >
                                                <Star className={`w-4 h-4 ${prize.isSpecial ? 'fill-white' : ''}`} />
                                                {prize.isSpecial ? 'Phần Quà Đặc Biệt' : 'Đặt là đặc biệt'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
                                <button
                                    onClick={() => setConfirmReset(true)}
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
                                        className="flex-1 px-4 py-2.5 bg-linear-to-r from-[#0054A6] to-[#003D7A] hover:opacity-90 text-white font-medium rounded-lg transition-opacity shadow-md"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Confirm Bulk Delete Modal */}
                        <ConfirmModal
                            isOpen={confirmBulkDelete}
                            onClose={() => setConfirmBulkDelete(false)}
                            onConfirm={confirmBulkDeletePrizes}
                            title="Xóa Nhiều Phần Quà?"
                            message={`Bạn có chắc muốn xóa ${selectedPrizeIds.length} ô đã chọn? Bạn vẫn cần nhấn "Lưu" để áp dụng thay đổi.`}
                            confirmText="Xóa tất cả"
                            cancelText="Hủy"
                            type="danger"
                        />

                        {/* Confirm Delete Modal */}
                        <ConfirmModal
                            isOpen={confirmDelete.isOpen}
                            onClose={() => setConfirmDelete({ isOpen: false, prizeId: null, prizeName: '' })}
                            onConfirm={confirmDeletePrize}
                            title="Xóa Phần Quà?"
                            message={`Bạn có chắc muốn xóa "${confirmDelete.prizeName}"? Bạn vẫn cần nhấn "Lưu" để áp dụng thay đổi.`}
                            confirmText="Xóa"
                            cancelText="Hủy"
                            type="danger"
                        />

                        {/* Confirm Reset Modal */}
                        <ConfirmModal
                            isOpen={confirmReset}
                            onClose={() => setConfirmReset(false)}
                            onConfirm={confirmResetPrizes}
                            title="Khôi Phục Mặc Định?"
                            message="Bạn có chắc muốn khôi phục về cài đặt mặc định? Tất cả thay đổi hiện tại sẽ bị mất."
                            confirmText="Khôi phục"
                            cancelText="Hủy"
                            type="warning"
                        />

                        {/* Toast */}
                        <Toast
                            isOpen={toast.isOpen}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
