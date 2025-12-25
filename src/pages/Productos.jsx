import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import FormularioProducto from '../components/FormularioProducto'

export default function Productos({ restauranteId }) {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [productoParaEditar, setProductoParaEditar] = useState(null)

    async function fetchProductos() {
        if (!restauranteId) return
        setLoading(true)
        const { data } = await supabase.from('productos').select('*').eq('restaurante_id', restauranteId).order('id', { ascending: true })
        if (data) setProductos(data)
        setLoading(false)
    }

    useEffect(() => { fetchProductos() }, [restauranteId])

    async function borrarProducto(id) {
        if (!window.confirm("¿Seguro de borrar este plato?")) return
        await supabase.from('productos').delete().eq('id', id)
        fetchProductos()
    }

    if (mostrarForm) {
        return <FormularioProducto alCerrar={() => { setMostrarForm(false); setProductoParaEditar(null); }} alGuardar={fetchProductos} productoAEditar={productoParaEditar} restauranteId={restauranteId} />
    }

    return (
        <div className="animate-in fade-in duration-700 text-left">
            <header className="flex justify-between items-center mb-8">
                <div><h1 className="text-3xl font-bold text-white italic">Gestión de Productos</h1><p className="text-gray-400 text-sm font-poppins">Administra el menú de tu restaurante.</p></div>
                <button onClick={() => setMostrarForm(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-lg font-black flex items-center gap-2 shadow-lg cursor-pointer transition-all"><Plus size={20} /> Nuevo Producto</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productos.map((prod) => (
                    <div key={prod.id} className="bg-[#181818] border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all group shadow-xl">
                        <div className="relative h-44 overflow-hidden">
                            <img src={prod.imagen_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                            <div className="absolute top-3 right-3"><span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${prod.activo ? 'bg-green-500' : 'bg-red-500'} text-white`}>{prod.activo ? 'Activo' : 'Inactivo'}</span></div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-white mb-1">{prod.nombre}</h3>
                            {/* --- BLOQUE DE PRECIO CON VIDA --- */}
                            <div className="mb-4 text-left h-14 flex flex-col justify-end">
                                {prod.precio_descuento && Number(prod.precio_descuento) < Number(prod.precio) ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {/* Precio original con raya roja sutil */}
                                            <span className="text-gray-500 text-sm line-through decoration-red-500/40">
                                                $ {Number(prod.precio).toLocaleString()}
                                            </span>
                                            {/* Badge de Ahorro calculado automáticamente */}
                                            <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-red-500/20">
                                                -{Math.round(((Number(prod.precio) - Number(prod.precio_descuento)) / Number(prod.precio)) * 100)}% OFF
                                            </span>
                                        </div>
                                        {/* Precio nuevo más grande y brillante */}
                                        <span className="text-yellow-500 font-black text-2xl leading-none tracking-tighter">
                                            $ {Number(prod.precio_descuento).toLocaleString()}
                                        </span>
                                    </>
                                ) : (
                                    /* Precio normal cuando no hay oferta */
                                    <span className="text-yellow-500 font-black text-2xl tracking-tighter">
                                        $ {Number(prod.precio).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setProductoParaEditar(prod); setMostrarForm(true); }} className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all text-xs font-bold cursor-pointer"><Edit3 size={14} /> Editar</button>
                                <button onClick={() => borrarProducto(prod.id)} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg transition-all text-xs font-bold cursor-pointer"><Trash2 size={14} /> Borrar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}