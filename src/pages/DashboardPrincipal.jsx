import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts'
import { DollarSign, ShoppingBag, Utensils, Layers, TrendingUp, BarChart3, ArrowUpRight } from 'lucide-react'

export default function DashboardPrincipal({ restauranteId }) {
    const [stats, setStats] = useState({ ventas: 0, pedidos: 0, productos: 0, categorias: 0 })
    const [dataVentas, setDataVentas] = useState([])
    const [topProductos, setTopProductos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDashboardData() {
            if (!restauranteId) return;
            setLoading(true)

            // 1. Traer Pedidos Filtrados
            const { data: pedidos } = await supabase.from('pedidos').select('*').eq('restaurante_id', restauranteId).order('fecha', { ascending: true })

            // 2. Traer Conteos Filtrados
            const { count: prodCount } = await supabase.from('productos').select('*', { count: 'exact', head: true }).eq('restaurante_id', restauranteId)
            const { count: catCount } = await supabase.from('categorias').select('*', { count: 'exact', head: true }).eq('restaurante_id', restauranteId)

            if (pedidos) {
                const total = pedidos.reduce((acc, curr) => acc + Number(curr.total), 0)

                // Gráfica de 7 días
                const ultimos7Dias = {}
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(); d.setDate(d.getDate() - i)
                    const f = d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', timeZone: 'America/Bogota' })
                    ultimos7Dias[f] = 0
                }
                pedidos.forEach(p => {
                    const f = new Date(p.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', timeZone: 'America/Bogota' })
                    if (ultimos7Dias.hasOwnProperty(f)) ultimos7Dias[f] += Number(p.total)
                })
                setDataVentas(Object.keys(ultimos7Dias).map(key => ({ name: key, total: ultimos7Dias[key] })))

                // Top Productos
                const conteoProds = {}
                pedidos.forEach(p => {
                    const carrito = p.carrito_json || []
                    carrito.forEach(item => {
                        const nombre = item.nombre || item.producto || "Desconocido"
                        conteoProds[nombre] = (conteoProds[nombre] || 0) + (item.cantidad || 1)
                    })
                })
                const barData = Object.keys(conteoProds).map(name => ({ name, cantidad: conteoProds[name] })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)

                setTopProductos(barData)
                setStats({ ventas: total, pedidos: pedidos.length, productos: prodCount || 0, categorias: catCount || 0 })
            }
            setLoading(false)
        }
        fetchDashboardData()
    }, [restauranteId])

    const cards = [
        { label: 'Ventas Totales', value: `$ .toLocaleString('es-CO')`, icon: <DollarSign size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Órdenes', value: stats.pedidos, icon: <ShoppingBag size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'En Menú', value: stats.productos, icon: <Utensils size={20} />, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Categorías', value: stats.categorias, icon: <Layers size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ]

    return (
        <div className="animate-in fade-in duration-700 text-left pb-10 w-full font-sans">
            <header className="mb-8">
                <h2 className="text-gray-400 text-sm font-medium">Bienvenido de nuevo, socio</h2>
                <h1 className="text-3xl font-bold italic text-white tracking-tight">Resumen del Negocio</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, i) => (
                    <div key={i} className="bg-[#181818] border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-gray-700 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>{card.icon}</div>
                            <ArrowUpRight size={16} className="text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">{card.label}</p>
                        <h3 className="text-2xl font-bold text-white italic">{loading ? '...' : card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#181818] border border-gray-800 p-8 rounded-3xl shadow-2xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white"><TrendingUp size={18} className="text-yellow-500" /> Tendencia de Ventas</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataVentas}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#444" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#444" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '12px' }} />
                                <Line type="monotone" dataKey="total" stroke="#facc15" strokeWidth={4} dot={{ r: 4, fill: '#facc15' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-[#181818] border border-gray-800 p-8 rounded-3xl shadow-2xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white"><BarChart3 size={18} className="text-blue-500" /> Top 5 Productos</h3>
                    <div className="h-[300px] w-full">
                        {topProductos.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProductos} layout="vertical" margin={{ left: -20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#999" fontSize={10} width={100} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#121212', border: '1px solid #333' }} />
                                    <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} barSize={20}>
                                        {topProductos.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#facc15' : '#3b82f6'} fillOpacity={0.8} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-gray-600 italic text-sm text-center">Sin datos.</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}