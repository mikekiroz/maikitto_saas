import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import FormularioCategoria from '../components/FormularioCategoria'

export default function Categorias({ restauranteId }) {
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [categoriaParaEditar, setCategoriaParaEditar] = useState(null)

    async function fetchCategorias() {
        if (!restauranteId) return
        setLoading(true)
        const { data } = await supabase
            .from('categorias')
            .select('*')
            .eq('restaurante_id', restauranteId) // <--- FILTRO DE SEGURIDAD
            .order('orden', { ascending: true })
        if (data) setCategorias(data)
        setLoading(false)
    }

    useEffect(() => { fetchCategorias() }, [restauranteId])

    async function borrarCategoria(id) {
        if (!window.confirm("¿Borrar categoría?")) return
        await supabase.from('categorias').delete().eq('id', id)
        fetchCategorias()
    }

    if (mostrarForm) {
        return (
            <FormularioCategoria
                alCerrar={() => { setMostrarForm(false); setCategoriaParaEditar(null); }}
                alGuardar={fetchCategorias}
                categoriaAEditar={categoriaParaEditar}
                restauranteId={restauranteId} // <--- PASAMOS EL ID AL FORMULARIO
            />
        )
    }

    return (
        <div className="animate-in fade-in duration-500 text-left">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold italic">Gestionar Categorías</h1>
                <button onClick={() => setMostrarForm(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer"><Plus size={20} /> Nueva Categoría</button>
            </header>
            <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-[#181818] text-gray-400 text-[11px] uppercase tracking-widest">
                        <tr><th className="px-6 py-4 font-bold">Nombre</th><th className="px-6 py-4 font-bold">Descripción</th><th className="px-6 py-4 font-bold text-right pr-10">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {categorias.map((cat) => (
                            <tr key={cat.id} className="hover:bg-yellow-500/[0.02] transition-colors group">
                                <td className="px-6 py-4 font-medium text-white">{cat.nombre}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{cat.descripcion || 'Sin descripción'}</td>
                                <td className="px-6 py-4 text-right pr-10">
                                    <div className="flex justify-end gap-4">
                                        <button onClick={() => { setCategoriaParaEditar(cat); setMostrarForm(true); }} className="text-gray-500 hover:text-yellow-500 transition-colors cursor-pointer"><Edit2 size={18} /></button>
                                        <button onClick={() => borrarCategoria(cat.id)} className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && categorias.length === 0 && <div className="p-20 text-center text-gray-600 italic font-poppins text-sm">No tienes categorías creadas todavía.</div>}
            </div>
        </div>
    )
}