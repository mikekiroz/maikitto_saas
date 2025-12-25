import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { MessageSquare, Edit3 } from 'lucide-react'

export default function MensajesBot({ restauranteId }) {
    const [mensajes, setMensajes] = useState([])
    const [loading, setLoading] = useState(true)
    const [editandoId, setEditandoId] = useState(null)
    const [textoEditado, setTextoEditado] = useState('')

    async function fetchMensajes() {
        setLoading(true)

        // 1. Traemos la Plantilla Universal que acabamos de crear en el SQL
        const { data: plantillas } = await supabase.from('mensajes_plantilla').select('*')

        // 2. Traemos los mensajes personalizados de María José (o el restaurante actual)
        const { data: personalizados } = await supabase
            .from('mensajes')
            .select('*')
            .eq('restaurante_id', restauranteId)

        // 3. LA MAGIA: Si María José tiene uno personalizado para un tipo (ej: Bienvenida), usamos ese.
        // Si no tiene nada, usamos el de la plantilla.
        const listaCombinada = plantillas.map(p => {
            const personalizado = personalizados?.find(pers => pers.tipo === p.tipo)
            if (personalizado) {
                return { ...personalizado, esPlantilla: false }
            } else {
                return { ...p, esPlantilla: true }
            }
        })

        setMensajes(listaCombinada)
        setLoading(false)
    }

    useEffect(() => {
        if (restauranteId) fetchMensajes()
    }, [restauranteId])

    const handleGuardar = async (m) => {
        if (m.esPlantilla) {
            // Si era una plantilla, CREAMOS un registro nuevo en la tabla 'mensajes' para este dueño
            const { error } = await supabase.from('mensajes').insert([{
                restaurante_id: restauranteId,
                tipo: m.tipo,
                mensaje: textoEditado
            }])
            if (error) alert(error.message)
        } else {
            // Si ya era un mensaje propio, lo ACTUALIZAMOS en la tabla 'mensajes'
            const { error } = await supabase.from('mensajes').update({ mensaje: textoEditado }).eq('id', m.id)
            if (error) alert(error.message)
        }

        setEditandoId(null)
        fetchMensajes()
    }

    const secciones = [
        { id: 'Bienvenida', titulo: 'Mensajes de Bienvenida' },
        { id: 'Despedida_Compra', titulo: 'Despedida (Compra Finalizada)' },
        { id: 'Despedida_Simple', titulo: 'Despedida (Sin Compra)' }
    ]

    return (
        <div className="animate-in fade-in duration-500 text-left pb-20 font-sans">
            <header className="mb-10">
                <h1 className="text-3xl font-bold italic text-white">Configuración del Bot</h1>
                <p className="text-gray-400 text-sm">Personaliza los mensajes que el asistente dirá a tus clientes.</p>
            </header>

            {secciones.map((seccion) => (
                <div key={seccion.id} className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
                        {seccion.titulo}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mensajes.filter(m => m.tipo === seccion.id).map((m, index) => (
                            <div key={m.id || index} className="bg-[#181818] border border-gray-800 rounded-2xl p-6 flex flex-col shadow-xl hover:border-yellow-500/30 transition-all">

                                {editandoId === (m.id || m.tipo + index) ? (
                                    <div className="flex flex-col gap-3">
                                        <textarea
                                            className="bg-[#121212] border border-yellow-500/50 rounded-xl p-4 text-white text-sm outline-none min-h-[100px]"
                                            value={textoEditado}
                                            onChange={(e) => setTextoEditado(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditandoId(null)} className="flex-1 bg-gray-800 py-2 rounded-lg text-xs font-bold cursor-pointer">Cancelar</button>
                                            <button onClick={() => handleGuardar(m)} className="flex-1 bg-yellow-500 text-black py-2 rounded-lg text-xs font-bold cursor-pointer">Guardar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${m.esPlantilla ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                                {m.esPlantilla ? 'PLANTILLA' : 'PERSONALIZADO'}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm italic mb-6 flex-1 leading-relaxed">"{m.mensaje}"</p>
                                        <button
                                            onClick={() => { setEditandoId(m.id || m.tipo + index); setTextoEditado(m.mensaje); }}
                                            className="flex items-center justify-end gap-2 text-yellow-500 text-xs font-bold cursor-pointer transition-all hover:scale-105"
                                        >
                                            <Edit3 size={14} /> EDITAR
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}