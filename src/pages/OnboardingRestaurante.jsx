import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Store, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OnboardingRestaurante({ userId, userEmail, alTerminar }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre_restaurante: '',
        telefono: '',
        ciudad: '',
        direccion: '',
        user_id: userId,
        email: userEmail,
        esta_abierto: true
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Guardar el restaurante con todos sus datos
            const { error } = await supabase.from('restaurantes').insert([formData])
            if (error) throw error

            // 2. Mensaje de éxito elegante
            toast.success('¡Negocio configurado con éxito! 🥂')

            // 3. Avisar a la App que ya puede mostrar el Dashboard
            alTerminar()
        } catch (error) {
            toast.error('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 text-left font-sans">
            <div className="bg-[#181818] p-10 rounded-3xl border border-gray-800 w-full max-w-xl shadow-2xl">
                <header className="mb-10 text-center">
                    <img src="https://res.cloudinary.com/dapd6legd/image/upload/v1763001434/maikitto4_dp4bco.png" className="h-10 mb-6 mx-auto" />
                    <h1 className="text-3xl font-bold text-white mb-2 italic">¡Bienvenido a Maikitto!</h1>
                    <p className="text-gray-400 text-sm">Configura tu negocio para activar el asistente de WhatsApp.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Nombre del Negocio</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            <input required className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 pl-12 text-white outline-none focus:border-yellow-500 transition-all"
                                placeholder="Ej: Sabor Criollo" value={formData.nombre_restaurante} onChange={(e) => setFormData({ ...formData, nombre_restaurante: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Celular de Domicilios</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-gray-600" size={18} />
                                <input required className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 pl-12 text-white outline-none focus:border-yellow-500"
                                    placeholder="310..." value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Ciudad</label>
                            <input required className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500"
                                placeholder="Ej: Bogotá" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Dirección del Local</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            <input required className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 pl-12 text-white outline-none focus:border-yellow-500"
                                placeholder="Calle 10 # 22..." value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 mt-4 cursor-pointer active:scale-95 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" /> : 'Finalizar y entrar al Panel'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>
            </div>
        </div>
    )
}