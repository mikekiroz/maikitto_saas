import React from 'react'
import { supabase } from '../lib/supabase'
import {
    LayoutDashboard,
    Utensils,
    ClipboardList,
    ShoppingBag,
    TrendingUp,
    Store,
    MessageSquare,
    Ticket,
    Star,
    LogOut
} from 'lucide-react'

const menuItems = [
    { id: 'Dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'Categorias', icon: <Utensils size={20} />, label: 'Categorías' },
    { id: 'Productos', icon: <ClipboardList size={20} />, label: 'Productos' },
    { id: 'Pedidos', icon: <ShoppingBag size={20} />, label: 'Pedidos' },
    { id: 'Ventas', icon: <TrendingUp size={20} />, label: 'Ventas' },
    { id: 'Restaurante', icon: <Store size={20} />, label: 'Restaurante' },
    { id: 'Mensajes', icon: <MessageSquare size={20} />, label: 'Mensajes del Bot' },
    { id: 'Cupones', icon: <Ticket size={20} />, label: 'Cupones' },
    { id: 'Calificaciones', icon: <Star size={20} />, label: 'Calificaciones' },
]

export default function Sidebar({ activeTab, setActiveTab }) {
    const handleLogout = async () => {
        await supabase.auth.signOut()
    }
    return (
        <div className="w-64 h-screen bg-[#121212] border-r border-gray-800 p-4 flex flex-col fixed left-0 top-0 overflow-y-auto custom-scrollbar">
            <div className="mb-8 px-4 flex flex-col items-start">
                <img
                    src="https://res.cloudinary.com/dapd6legd/image/upload/v1763001434/maikitto4_dp4bco.png"
                    alt="Maikitto Logo"
                    className="h-10 w-auto mb-2"
                />
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Panel de Control</p>
            </div>

            <nav className="flex-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-all cursor-pointer ${activeTab === item.id
                            ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="pt-4 mt-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}