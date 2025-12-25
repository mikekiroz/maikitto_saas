import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Eye, Search, Calendar, Filter, X } from 'lucide-react'

export default function Pedidos({ restauranteId }) {
    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')

    const fetchPedidos = async () => {
        if (!restauranteId) return
        setLoading(true)
        let query = supabase.from('pedidos').select('*').eq('restaurante_id', restauranteId).order('fecha', { ascending: false })

        if (searchTerm) query = query.ilike('nombre_cliente', `%${searchTerm}%`)
        if (fechaInicio) query = query.gte('fecha', fechaInicio)
        if (fechaFin) query = query.lte('fecha', fechaFin)

        const { data } = await query
        if (data) setPedidos(data)
        setLoading(false)
    }

    useEffect(() => { fetchPedidos() }, [searchTerm, fechaInicio, fechaFin, restauranteId])

    const getStatusStyle = (s) => {
        if (s === 'confirmed') return 'bg-green-500/10 text-green-500 border-green-500/20'
        if (s === 'cancelled') return 'bg-red-500/10 text-red-500 border-red-500/20'
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }

    return (
        <div className="animate-in fade-in duration-500 text-left">
            <header className="mb-8">
                <h1 className="text-3xl font-bold italic">Historial de Pedidos</h1>
                <p className="text-gray-400 text-sm">Gestiona las órdenes recibidas por el bot.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-[#121212] p-4 rounded-xl border border-gray-800 shadow-inner">
                <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Buscar por cliente..." className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-yellow-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <input type="date" className="bg-[#0a0a0a] border border-gray-700 rounded-lg py-2 px-4 text-sm text-white outline-none focus:border-yellow-500 color-scheme-dark" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                <input type="date" className="bg-[#0a0a0a] border border-gray-700 rounded-lg py-2 px-4 text-sm text-white outline-none focus:border-yellow-500 color-scheme-dark" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left font-poppins">
                    <thead className="bg-[#181818] text-gray-400 text-[11px] uppercase tracking-widest">
                        <tr><th className="px-6 py-4 font-bold">ID</th><th className="px-6 py-4 font-bold">Cliente</th><th className="px-6 py-4 font-bold">Fecha</th><th className="px-6 py-4 font-bold text-center">Total</th><th className="px-6 py-4 font-bold text-center">Estado</th><th className="px-6 py-4 font-bold text-right pr-10">Acción</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {pedidos.map((ped) => (
                            <tr key={ped.id} className="hover:bg-yellow-500/[0.02] transition-colors group">
                                <td className="px-6 py-4 text-xs font-mono text-gray-600">#{ped.id}</td>
                                <td className="px-6 py-4 font-bold text-white">{ped.nombre_cliente || 'Cliente WhatsApp'}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{new Date(ped.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Bogota' })}</td>
                                <td className="px-6 py-4 text-center font-bold text-yellow-500">$ {Number(ped.total).toLocaleString()}</td>
                                <td className="px-6 py-4 text-center"><span className={`text-[10px] px-2 py-1 rounded border font-black uppercase ${getStatusStyle(ped.status)}`}>{ped.status}</span></td>
                                <td className="px-6 py-4 text-right pr-10"><button className="bg-gray-800/50 p-2 rounded-lg text-gray-400 hover:text-yellow-500 transition-all cursor-pointer"><Eye size={18} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && pedidos.length === 0 && <div className="p-20 text-center text-gray-600 italic">No se encontraron pedidos.</div>}
            </div>
        </div>
    )
}