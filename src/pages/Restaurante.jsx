import toast from 'react-hot-toast'
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CheckCircle, Lock, Save, Smartphone, MapPin, DollarSign, Globe } from 'lucide-react'

export default function Restaurante({ restauranteId, alActualizar }) {
    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [restaurante, setRestaurante] = useState({
        nombre_restaurante: '',
        telefono: '',
        ciudad: '',
        direccion: '',
        logo_url: '',
        esta_abierto: false,
        radio_cobertura_km: 5,
        costo_domicilio_base: 0,
        whatsapp_instance_name: '',
        whatsapp_status: 'connected'
    })

    useEffect(() => {
        async function fetchRestaurante() {
            if (!restauranteId) return
            setLoading(true)
            const { data } = await supabase.from('restaurantes').select('*').eq('id', restauranteId).single()
            if (data) setRestaurante(data)
            setLoading(false)
        }
        fetchRestaurante()
    }, [restauranteId])

    const handleGuardar = async () => {
        setGuardando(true)
        try {
            const { error } = await supabase.from('restaurantes').update(restaurante).eq('id', restauranteId)
            if (error) throw error
            if (alActualizar) await alActualizar()
            toast.success("¡Configuración guardada con éxito! 🚀")
        } catch (error) {
            toast.error('Hubo un problema al guardar.')
        } finally {
            setGuardando(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center h-[50vh] text-gray-500 italic animate-pulse">Cargando tablero de mando...</div>

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20 text-left font-sans">
            <header className="mb-10">
                <h1 className="text-3xl font-bold italic text-white tracking-tight">Configuración del Restaurante</h1>
                <p className="text-gray-400 text-sm">Gestiona la información pública y operativa de tu negocio.</p>
            </header>

            <div className="space-y-10">

                {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
                <section className="bg-[#181818] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">Información del Restaurante</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre del Restaurante</label>
                            <input className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500 transition-all" value={restaurante.nombre_restaurante} onChange={(e) => setRestaurante({ ...restaurante, nombre_restaurante: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Teléfono de Contacto</label>
                                <input className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500" value={restaurante.telefono || ''} onChange={(e) => setRestaurante({ ...restaurante, telefono: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ciudad *</label>
                                <input className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500" value={restaurante.ciudad || ''} onChange={(e) => setRestaurante({ ...restaurante, ciudad: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dirección (Calle, Carrera, etc.) *</label>
                            <textarea rows="2" className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500" value={restaurante.direccion || ''} onChange={(e) => setRestaurante({ ...restaurante, direccion: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL del Logo</label>
                            <input className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500 text-xs font-mono" value={restaurante.logo_url || ''} onChange={(e) => setRestaurante({ ...restaurante, logo_url: e.target.value })} />
                        </div>

                        <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${restaurante.esta_abierto ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <input type="checkbox" className="w-6 h-6 accent-yellow-500 cursor-pointer" checked={restaurante.esta_abierto} onChange={(e) => setRestaurante({ ...restaurante, esta_abierto: e.target.checked })} />
                            <span className={`font-black uppercase text-xs tracking-tighter ${restaurante.esta_abierto ? 'text-yellow-500' : 'text-red-500'}`}>
                                {restaurante.esta_abierto ? 'Restaurante Abierto' : 'Restaurante Cerrado'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 2: DOMICILIOS */}
                <section className="bg-[#181818] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 text-white">Configuración de Domicilios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Radio de Cobertura (KM)</label>
                            <input type="number" className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500" value={restaurante.radio_cobertura_km || 0} onChange={(e) => setRestaurante({ ...restaurante, radio_cobertura_km: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Costo del Domicilio ($ COP)</label>
                            <input type="number" className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3.5 text-white outline-none focus:border-yellow-500" value={restaurante.costo_domicilio_base || 0} onChange={(e) => setRestaurante({ ...restaurante, costo_domicilio_base: e.target.value })} />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={handleGuardar} disabled={guardando} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-12 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
                            {guardando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </section>

                {/* SECCIÓN 3: WHATSAPP (Visual/Estatus) */}
                <section className="bg-[#181818] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 text-white">Asistente Virtual por WhatsApp</h2>
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex items-center gap-5">
                        <div className="bg-green-500 p-3 rounded-full shadow-lg shadow-green-500/20">
                            <CheckCircle className="text-black" size={28} />
                        </div>
                        <div>
                            <h3 className="text-green-500 font-black text-xl uppercase tracking-tighter">¡Tu Asistente está Activo!</h3>
                            <p className="text-gray-400 text-sm">Conectado a la instancia: <span className="text-white font-bold">{restaurante.whatsapp_instance_name || restaurante.nombre_restaurante.toLowerCase().replace(/\s+/g, '_')}</span></p>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 4: SEGURIDAD (CAMBIO DE CLAVE NIVEL BANCO) */}
                <section className="bg-[#181818] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Lock size={20} className="text-yellow-500" /> Seguridad de la Cuenta
                    </h2>

                    <div className="space-y-5 max-w-md text-left">
                        {/* 1. CLAVE ACTUAL */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-tighter">Contraseña Actual</label>
                            <input
                                type="password"
                                id="clave-actual"
                                placeholder="Ingresa tu clave actual"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                            />
                        </div>

                        {/* 2. NUEVA CLAVE */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-tighter">Nueva Contraseña</label>
                            <input
                                type="password"
                                id="clave-nueva"
                                placeholder="Mínimo 6 caracteres"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                            />
                        </div>

                        {/* 3. CONFIRMACIÓN */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-tighter">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                id="clave-confirmar"
                                placeholder="Repite tu nueva clave"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                            />
                        </div>

                        <button
                            onClick={async () => {
                                const actual = document.getElementById('clave-actual').value;
                                const nueva = document.getElementById('clave-nueva').value;
                                const confirmar = document.getElementById('clave-confirmar').value;

                                if (!actual || !nueva || !confirmar) return alert("Socio, llena todos los campos.");
                                if (nueva.length < 6) return alert("La nueva clave debe tener al menos 6 caracteres.");
                                if (nueva !== confirmar) return alert("La nueva clave y la confirmación no coinciden.");

                                setGuardando(true);

                                // Lógica Pro: Primero re-autenticamos para validar la clave vieja
                                const { error: authError } = await supabase.auth.signInWithPassword({
                                    email: restaurante.email,
                                    password: actual
                                });

                                if (authError) {
                                    alert("La contraseña actual es incorrecta. ❌");
                                } else {
                                    // Si la vieja es correcta, actualizamos a la nueva
                                    const { error: updateError } = await supabase.auth.updateUser({ password: nueva });
                                    if (updateError) alert(updateError.message);
                                    else {
                                        alert("¡Contraseña actualizada con éxito! 🔐");
                                        document.getElementById('clave-actual').value = '';
                                        document.getElementById('clave-nueva').value = '';
                                        document.getElementById('clave-confirmar').value = '';
                                    }
                                }
                                setGuardando(false);
                            }}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {guardando ? 'Verificando...' : 'Actualizar Contraseña'}
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <p className="text-[10px] text-blue-400/80 italic leading-relaxed">
                            * Nota de Seguridad: Si tu cuenta fue creada con Google, la contraseña se gestiona directamente en los ajustes de tu cuenta de Google. Maikitto no almacena claves de terceros.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    )
}