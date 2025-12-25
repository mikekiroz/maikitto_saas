import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Star, User } from 'lucide-react'

export default function Calificaciones({ restauranteId }) {
    const [calificaciones, setCalificaciones] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCalificaciones() {
            if (!restauranteId) return
            const { data } = await supabase.from('calificaciones').select('*').eq('restaurante_id', restauranteId).order('fecha', { ascending: false })
            if (data) setCalificaciones(data)
            setLoading(false)
        }
        fetchCalificaciones()
    }, [restauranteId])

    return (
        <div className="animate-in fade-in duration-700 text-left">
            <header className="mb-8"><h1 className="text-3xl font-bold italic">Calificaciones</h1></header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {calificaciones.map((c) => (
                    <div key={c.id} className="bg-[#181818] border border-gray-800 p-6 rounded-2xl shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500"><User size={20} /></div>
                                <h3 className="font-bold text-white">{c.nombre_cliente}</h3>
                            </div>
                            <div className="flex gap-1 text-yellow-500">{[...Array(c.calificacion)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                        </div>
                        <p className="text-gray-400 text-sm italic">"{c.comentario}"</p>
                    </div>
                ))}
            </div>
            {!loading && calificaciones.length === 0 && <div className="p-20 text-center border border-dashed border-gray-800 rounded-3xl text-gray-700 italic">No tienes calificaciones aún.</div>}
        </div>
    )
}