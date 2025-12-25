import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Info } from 'lucide-react'

export default function FormularioProducto({ alCerrar, alGuardar, productoAEditar, restauranteId }) {
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState([])
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        precio_descuento: '',
        categoria_id: '',
        descripcion: '',
        imagen_url: '',
        activo: true,
        restaurante_id: restauranteId
    })

    // 1. Cargar categorías y datos si estamos editando
    useEffect(() => {
        async function init() {
            const { data } = await supabase.from('categorias').select('id, nombre').eq('restaurante_id', restauranteId)
            if (data) setCategorias(data)

            // Si nos pasaron un producto para editar, llenamos el formulario
            if (productoAEditar) {
                setFormData(productoAEditar)
            }
        }
        init()
    }, [productoAEditar, restauranteId])
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToSend = { ...formData }

            // Si el producto es NUEVO, borramos el ID para que la base de datos use el contador (26, 27...)
            if (!productoAEditar) {
                delete dataToSend.id
            }

            if (productoAEditar) {
                // LÓGICA DE ACTUALIZAR
                const { error } = await supabase
                    .from('productos')
                    .update(dataToSend)
                    .eq('id', productoAEditar.id)
                if (error) throw error
            } else {
                // LÓGICA DE CREAR
                const { error } = await supabase
                    .from('productos')
                    .insert([dataToSend])
                if (error) throw error
            }

            alGuardar()
            alCerrar()
        } catch (err) {
            alert("Error al procesar: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    {productoAEditar ? `Editando: ${productoAEditar.nombre}` : 'Añadir Nuevo Producto'}
                </h1>
                <button onClick={alCerrar} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold cursor-pointer">
                    <ArrowLeft size={16} /> Volver
                </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* Usamos el mismo diseño de antes, solo cambiamos el botón final */}
                <div className="bg-[#181818] p-6 rounded-xl border border-gray-800 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Producto</label>
                        <input
                            required className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 outline-none focus:border-yellow-500 text-sm"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Precio</label>
                            <input
                                required type="number" className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 outline-none focus:border-yellow-500 text-sm"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Precio Descuento</label>
                            <input
                                type="number" className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 outline-none focus:border-yellow-500 text-sm"
                                value={formData.precio_descuento}
                                onChange={(e) => setFormData({ ...formData, precio_descuento: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Categoría</label>
                        <select
                            required className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 outline-none focus:border-yellow-500 text-sm"
                            value={formData.categoria_id}
                            onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Descripción</label>
                        <textarea
                            rows="3" className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 outline-none focus:border-yellow-500 text-sm"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">URL Imagen (Cloudinary)</label>
                        <input
                            className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 outline-none focus:border-yellow-500 text-sm"
                            value={formData.imagen_url}
                            onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center gap-3 bg-[#121212] p-3 rounded-lg border border-gray-700">
                        <input
                            type="checkbox" className="w-4 h-4 accent-yellow-500"
                            checked={formData.activo}
                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        />
                        <span className="text-sm font-medium">Activo en el menú</span>
                    </div>
                </div>

                <button disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl shadow-lg transition-all">
                    {loading ? 'Guardando...' : (productoAEditar ? 'Guardar Cambios' : 'Crear Producto')}
                </button>
            </form>
        </div>
    )
}