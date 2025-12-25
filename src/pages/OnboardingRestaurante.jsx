import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Store, ArrowRight, Loader2 } from 'lucide-react'

export default function OnboardingRestaurante({ userId, userEmail, alTerminar }) {
    const [loading, setLoading] = useState(false)
    const [nombre, setNombre] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Crear el restaurante
            const { data: nuevoRest, error: errorRest } = await supabase
                .from('restaurantes')
                .insert([{
                    nombre_restaurante: nombre,
                    user_id: userId,
                    email: userEmail,
                    esta_abierto: true
                }])
                .select()
                .single()

            if (errorRest) throw errorRest

            // 2. SEMBRAR MENSAJES INICIALES (Plantilla Universal)
            // Copiamos los textos base para que el cliente no empiece de cero
            const mensajesBase = [
                { restaurante_id: nuevoRest.id, tipo: 'Bienvenida', mensaje: '¡Hola! Bienvenido a ' + nombre + ' 🍽️' },
                { restaurante_id: nuevoRest.id, tipo: 'Bienvenida', mensaje: '¡Qué gusto tenerte aquí! 😊' },
                { restaurante_id: nuevoRest.id, tipo: 'Despedida_Compra', mensaje: '¡Gracias por tu pedido! Estará listo pronto 🛵' },
                { restaurante_id: nuevoRest.id, tipo: 'Despedida_Simple', mensaje: '¡Hasta luego! Vuelve pronto 👋' }
            ]

            const { error: errorMsg } = await supabase.from('mensajes').insert(mensajesBase)
            if (errorMsg) console.log("Error sembrando mensajes:", errorMsg.message)

            alTerminar()
        } catch (error) {
            alert("Error: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 text-left">
            <div className="bg-[#181818] p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-2 italic">¡Bienvenido a Maikitto!</h1>
                <p className="text-gray-400 text-sm mb-8">Para empezar, dinos el nombre de tu negocio.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre del Restaurante</label>
                        <input required className="w-full bg-[#121212] border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
                            placeholder="Ej: Sabor Criollo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <button disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer">
                        {loading ? <Loader2 className="animate-spin" /> : 'Crear mi Panel'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>
            </div>
        </div>
    )
}