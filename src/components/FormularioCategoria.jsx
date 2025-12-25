import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FormularioCategoria({ alCerrar, alGuardar, categoriaAEditar, restauranteId }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        activo: true,
        restaurante_id: restauranteId // Usamos el ID real que viene de App.jsx
    })

    useEffect(() => {
        if (categoriaAEditar) {
            setFormData(categoriaAEditar)
        }
    }, [categoriaAEditar])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToSend = { ...formData }

            if (categoriaAEditar) {
                // LÓGICA DE ACTUALIZAR
                const { error } = await supabase
                    .from('categorias')
                    .update(dataToSend)
                    .eq('id', categoriaAEditar.id)
                if (error) throw error
            } else {
                // LÓGICA DE CREAR
                // Borramos el id si existiera para que no choque con los de El Comelón
                delete dataToSend.id
                dataToSend.restaurante_id = restauranteId // Aseguramos que se guarde con el dueño correcto

                const { error } = await supabase
                    .from('categorias')
                    .insert([dataToSend])
                if (error) throw error
            }

            alGuardar()
            alCerrar()
        } catch (error) {
            alert("Error: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-start pt-10 animate-in fade-in zoom-in duration-300">
            <div className="bg-[#181818] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-white text-left italic">
                    {categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de la Categoría</label>
                        <input
                            required
                            placeholder="Ej: Entradas, Bebidas..."
                            className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all font-sans"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Descripción (Opcional)</label>
                        <textarea
                            rows="3"
                            placeholder="Describe esta categoría..."
                            className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all font-sans"
                            value={formData.descripcion || ''}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={alCerrar}
                            className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white font-bold py-3 rounded-xl transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={loading}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Cargando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}