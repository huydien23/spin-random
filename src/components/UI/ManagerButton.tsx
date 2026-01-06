import { Settings } from 'lucide-react'
import { motion } from 'framer-motion'

interface ManagerButtonProps {
    onClick: () => void
}

export default function ManagerButton({ onClick }: ManagerButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#0054A6] to-[#003D7A] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-30 group"
            title="Quản lý phần quà (Admin)"
        >
            <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
    )
}
