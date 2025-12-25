import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, Trash2, Ticket } from 'lucide-react'
import FormularioCupon from '../components/FormularioCupon'

export default function Cupones({ restauranteId }) {
    const [cupones, setCupones] = useState([])
    const [loading, setLoading] = useState(true)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [cuponParaEditar, setCuponParaEditar] = useState(null)

    async function fetchCupones() {
        if (!restauranteId) return
        setLoading(true)
        const { data } = await supabase
            .from('cupones')
            .select('*')
            .eq('restaurante_id', restauranteId) // <--- FILTRO
            .order('id', { ascending: false })
        if (data) setCupones(data)
        setLoading(false)
    }

    useEffect(() => { fetchCupones() }, [restauranteId])

    if (mostrarForm) {
        return <FormularioCupon alCerrar={() => { setMostrarForm(false); setCuponParaEditar(null); }} alGuardar={fetchCupones} cuponAEditar={cuponParaEditar} restauranteId={restauranteId} />
    }

    return (
        <div className="animate-in fade-in duration-500 text-left">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold italic">Gestionar Cupones</h1>
                <button onClick={() => setMostrarForm(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-lg cursor-pointer"><Plus size={20} /> Nuevo Cupón</button>
            </header>
            <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-[#181818] text-gray-400 text-[11px] uppercase tracking-widest">
                        <tr><th className="px-6 py-4 font-bold">Código</th><th className="px-6 py-4 font-bold">Estado</th><th className="px-6 py-4 font-bold text-right pr-10">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {cupones.map((c) => (
                            <tr key={c.id} className="hover:bg-yellow-500/[0.02] transition-colors">
                                <td className="px-6 py-4 font-black text-yellow-500">{c.codigo}</td>
                                <td className="px-6 py-4"><span className={`text-[10px] px-2 py-1 rounded font-bold ${c.activo ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{c.activo ? 'ACTIVO' : 'INACTIVO'}</span></td>
                                <td className="px-6 py-4 text-right pr-10">
                                    <div className="flex justify-end gap-4">
                                        <button onClick={() => { setCuponParaEditar(c); setMostrarForm(true); }} className="text-gray-500 hover:text-yellow-500 cursor-pointer"><Edit2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && cupones.length === 0 && <div className="p-20 text-center text-gray-600 italic">No hay cupones creados.</div>}
            </div>
        </div>
    )
}