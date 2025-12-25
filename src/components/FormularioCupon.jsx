import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Check, ArrowLeft } from 'lucide-react'

export default function FormularioCupon({ alCerrar, alGuardar, cuponAEditar }) {
    const [loading, setLoading] = useState(false)
    const [productosDisponibles, setProductosDisponibles] = useState([])
    const [productosSeleccionados, setProductosSeleccionados] = useState([])

    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        tipo_descuento: 'porcentaje',
        valor_descuento: '',
        fecha_inicio: '',
        fecha_expiracion: '',
        usos_maximos: '',
        monto_minimo_compra: 0,
        aplicabilidad: 'carrito_completo',
        activo: true,
        restaurante_id: 1
    })

    useEffect(() => {
        async function init() {
            // 1. Cargar productos
            const { data: prods } = await supabase.from('productos').select('id, nombre').order('nombre')
            if (prods) setProductosDisponibles(prods)

            // 2. Si es edición, cargar datos
            if (cuponAEditar) {
                const formatFecha = (f) => f ? f.split('T')[0] : ''
                setFormData({
                    ...cuponAEditar,
                    fecha_inicio: formatFecha(cuponAEditar.fecha_inicio),
                    fecha_expiracion: formatFecha(cuponAEditar.fecha_expiracion)
                })

                // 3. Cargar productos asociados
                const { data: rels } = await supabase
                    .from('cupon_productos')
                    .select('producto_id')
                    .eq('cupon_id', cuponAEditar.id)

                if (rels) setProductosSeleccionados(rels.map(r => r.producto_id))
            }
        }
        init()
    }, [cuponAEditar])

    const toggleProducto = (id) => {
        if (productosSeleccionados.includes(id)) {
            setProductosSeleccionados(productosSeleccionados.filter(item => item !== id))
        } else {
            setProductosSeleccionados([...productosSeleccionados, id])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Limpieza de tipos de datos para PostgreSQL
            const dataToSend = {
                ...formData,
                valor_descuento: Number(formData.valor_descuento),
                monto_minimo_compra: formData.monto_minimo_compra ? Number(formData.monto_minimo_compra) : 0,
                usos_maximos: formData.usos_maximos ? Number(formData.usos_maximos) : null,
                fecha_inicio: formData.fecha_inicio || null,
                fecha_expiracion: formData.fecha_expiracion || null
            }

            let couponId = cuponAEditar?.id

            if (cuponAEditar) {
                const { error: updError } = await supabase.from('cupones').update(dataToSend).eq('id', cuponAEditar.id)
                if (updError) throw updError
            } else {
                const { data, error: insError } = await supabase.from('cupones').insert([dataToSend]).select().single()
                if (insError) throw insError
                couponId = data.id
            }

            if (formData.aplicabilidad === 'productos_especificos') {
                await supabase.from('cupon_productos').delete().eq('cupon_id', couponId)
                const relaciones = productosSeleccionados.map(prodId => ({
                    cupon_id: couponId,
                    producto_id: prodId
                }))
                if (relaciones.length > 0) {
                    const { error: relError } = await supabase.from('cupon_productos').insert(relaciones)
                    if (relError) throw relError
                }
            }

            alert("¡Cupón guardado con éxito! 🎁")
            alGuardar()
            alCerrar()
        } catch (err) {
            alert("Error: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-start pt-4 animate-in fade-in zoom-in duration-300 pb-20">
            <div className="bg-[#181818] p-8 rounded-2xl border border-gray-800 w-full max-w-lg shadow-2xl text-left">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white italic">
                        {cuponAEditar ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
                    </h2>
                    <button type="button" onClick={alCerrar} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-bold cursor-pointer transition-colors">
                        <ArrowLeft size={14} /> Volver
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Código del Cupón</label>
                        <input
                            required
                            className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 uppercase transition-all"
                            value={formData.codigo}
                            onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Tipo Descuento</label>
                            <select
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all"
                                value={formData.tipo_descuento}
                                onChange={(e) => setFormData({ ...formData, tipo_descuento: e.target.value })}
                            >
                                <option value="porcentaje">Porcentaje (%)</option>
                                <option value="monto_fijo">Valor Fijo ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Valor</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all"
                                value={formData.valor_descuento}
                                onChange={(e) => setFormData({ ...formData, valor_descuento: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Fecha Inicio</label>
                            <input
                                type="date"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 color-scheme-dark"
                                value={formData.fecha_inicio}
                                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Fecha Expiración</label>
                            <input
                                type="date"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 color-scheme-dark"
                                value={formData.fecha_expiracion}
                                onChange={(e) => setFormData({ ...formData, fecha_expiracion: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Límite de Usos</label>
                            <input
                                type="number"
                                placeholder="Ej: 100"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500"
                                value={formData.usos_maximos || ''}
                                onChange={(e) => setFormData({ ...formData, usos_maximos: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Monto Mínimo</label>
                            <input
                                type="number"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500"
                                value={formData.monto_minimo_compra}
                                onChange={(e) => setFormData({ ...formData, monto_minimo_compra: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Aplicar a:</label>
                        <select
                            className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all"
                            value={formData.aplicabilidad}
                            onChange={(e) => setFormData({ ...formData, aplicabilidad: e.target.value })}
                        >
                            <option value="carrito_completo">Todo el carrito</option>
                            <option value="productos_especificos">Productos específicos</option>
                        </select>
                    </div>

                    {formData.aplicabilidad === 'productos_especificos' && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-bold text-yellow-500 mb-2 uppercase">Selecciona los platos:</label>
                            <div className="bg-[#121212] border border-gray-800 rounded-xl max-h-40 overflow-y-auto p-2">
                                {productosDisponibles.map(prod => (
                                    <div
                                        key={prod.id}
                                        onClick={() => toggleProducto(prod.id)}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer border-b border-gray-900 last:border-0 transition-colors"
                                    >
                                        <span className="text-xs text-gray-300">{prod.nombre}</span>
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${productosSeleccionados.includes(prod.id) ? 'bg-yellow-500 border-yellow-500' : 'border-gray-700'}`}>
                                            {productosSeleccionados.includes(prod.id) && <Check size={12} className="text-black font-bold" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Guardando...' : (cuponAEditar ? 'Guardar Cambios' : 'Crear Cupón')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}