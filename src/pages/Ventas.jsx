import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp, DollarSign, ShoppingBag, Calendar, Filter, X } from 'lucide-react'

export default function Ventas({ restauranteId }) {
    const [dataGrafica, setDataGrafica] = useState([])
    const [stats, setStats] = useState({ total: 0, cantidad: 0 })
    const [loading, setLoading] = useState(true)
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')

    async function fetchVentas() {
        if (!restauranteId) return
        setLoading(true)
        let query = supabase.from('pedidos').select('total, fecha').eq('restaurante_id', restauranteId).order('fecha', { ascending: true })

        if (fechaInicio) query = query.gte('fecha', fechaInicio)
        if (fechaFin) query = query.lte('fecha', fechaFin)

        const { data } = await query
        if (data) {
            const totalDinero = data.reduce((acc, curr) => acc + Number(curr.total), 0)
            setStats({ total: totalDinero, cantidad: data.length })
            const agrupado = data.reduce((acc, item) => {
                const fecha = new Date(item.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', timeZone: 'America/Bogota' })
                acc[fecha] = (acc[fecha] || 0) + Number(item.total)
                return acc
            }, {})
            setDataGrafica(Object.keys(agrupado).map(key => ({ name: key, ventas: agrupado[key] })))
        }
        setLoading(false)
    }

    useEffect(() => { fetchVentas() }, [fechaInicio, fechaFin, restauranteId])

    return (
        <div className="animate-in fade-in duration-700 text-left pb-20">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold italic text-white">Análisis de Ventas</h1>
                    <p className="text-gray-400 text-sm font-poppins">Rendimiento económico de tu negocio.</p>
                </div>
                <div className="flex items-center gap-3 bg-[#121212] p-2 rounded-2xl border border-gray-800 shadow-lg">
                    <div className="flex flex-col bg-[#1c1c1c] px-5 py-2 rounded-xl border border-transparent focus-within:border-yellow-500/40 transition-all">
                        <span className="text-[9px] uppercase font-black text-yellow-500 tracking-widest mb-0.5">Desde</span>
                        <input type="date" className="bg-transparent text-sm text-white outline-none font-medium cursor-pointer color-scheme-dark" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                    </div>
                    <div className="text-gray-700 font-light text-xl">/</div>
                    <div className="flex flex-col bg-[#1c1c1c] px-5 py-2 rounded-xl border border-transparent focus-within:border-yellow-500/40 transition-all">
                        <span className="text-[9px] uppercase font-black text-yellow-500 tracking-widest mb-0.5">Hasta</span>
                        <input type="date" className="bg-transparent text-sm text-white outline-none font-medium cursor-pointer color-scheme-dark" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                    </div>
                    {(fechaInicio || fechaFin) && (
                        <button onClick={() => { setFechaInicio(''); setFechaFin('') }} className="p-3 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all cursor-pointer"><X size={18} /></button>
                    )}
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#181818] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><DollarSign size={24} /></div>
                    <div><p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Ingresos</p><h3 className="text-2xl font-bold text-white">$ {stats.total.toLocaleString()}</h3></div>
                </div>
                <div className="bg-[#181818] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><ShoppingBag size={24} /></div>
                    <div><p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Órdenes</p><h3 className="text-2xl font-bold text-white">{stats.cantidad}</h3></div>
                </div>
            </div>
            <div className="bg-[#181818] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-white"><TrendingUp size={18} className="text-yellow-500" /> Histórico de Ventas</h3>
                <div className="h-[350px] w-full">
                    {dataGrafica.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataGrafica}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#444" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#444" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '12px' }} />
                                <Line type="monotone" dataKey="ventas" stroke="#facc15" strokeWidth={4} dot={{ r: 4, fill: '#facc15' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-gray-600 italic">Sin datos en este rango.</div>}
                </div>
            </div>
        </div>
    )
}