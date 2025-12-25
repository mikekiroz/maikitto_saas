import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function Registro() {
    const [loading, setLoading] = useState(false)
    const [verPassword, setVerPassword] = useState(false)
    const [verConfirm, setVerConfirm] = useState(false)

    const [formData, setFormData] = useState({
        nombreCompleto: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleRegistroManual = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert("Socio, las contraseñas no coinciden.")
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.nombreCompleto
                }
            }
        })

        if (error) {
            alert("Error: " + error.message)
        } else {
            alert("¡Cuenta creada! Revisa tu correo para verificar tu cuenta.")
        }
        setLoading(false)
    }

    const handleGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        })
        if (error) alert(error.message)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 text-left font-sans">
            <div className="bg-[#1c1c1c] p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <img src="https://res.cloudinary.com/dapd6legd/image/upload/v1763001434/maikitto4_dp4bco.png" alt="Logo" className="h-10 mx-auto mb-2" />
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest italic">Crea tu cuenta de socio</p>
                    <h2 className="text-2xl font-bold text-white mt-6">Crea tu Cuenta</h2>
                </div>

                {/* El atributo 'name' en el form también ayuda al navegador */}
                <form name="registro-maikitto" onSubmit={handleRegistroManual} className="space-y-4">

                    {/* NOMBRE COMPLETO */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-600" size={16} />
                            <input
                                required
                                name="name"
                                autoComplete="name"
                                placeholder="Tu nombre"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 pl-10 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                                value={formData.nombreCompleto}
                                onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">Tu Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-600" size={16} />
                            <input
                                required
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="tu@email.com"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 pl-10 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* CONTRASEÑAS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">Contraseña</label>
                            <div className="relative">
                                <input
                                    required
                                    name="password"
                                    autoComplete="new-password"
                                    type={verPassword ? "text" : "password"}
                                    placeholder="••••"
                                    className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 pr-10 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setVerPassword(!verPassword)} className="absolute right-3 top-3 text-gray-600 hover:text-yellow-500 cursor-pointer">
                                    {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">Confirma</label>
                            <div className="relative">
                                <input
                                    required
                                    name="confirm-password"
                                    autoComplete="new-password"
                                    type={verConfirm ? "text" : "password"}
                                    placeholder="••••"
                                    className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 pr-10 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button type="button" onClick={() => setVerConfirm(!verConfirm)} className="absolute right-3 top-3 text-gray-600 hover:text-yellow-500 cursor-pointer">
                                    {verConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-95">
                        {loading ? 'Creando...' : 'Empezar ahora'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#1c1c1c] px-4 text-gray-500 font-bold">O usa tu cuenta de</span></div>
                </div>

                <button onClick={handleGoogle} className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Google
                </button>
            </div>
        </div>
    )
}