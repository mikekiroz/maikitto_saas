import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom' // Para navegar al registro

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [verPassword, setVerPassword] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        })
        if (error) alert("Error: " + error.message)
        setLoading(false)
    }

    const handleGoogle = async () => {
        await supabase.auth.signInWithOAuth({ provider: 'google' })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 text-left font-sans">
            <div className="bg-[#1c1c1c] p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <img src="https://res.cloudinary.com/dapd6legd/image/upload/v1763001434/maikitto4_dp4bco.png" alt="Logo" className="h-10 mx-auto mb-2" />
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest italic text-center">Bienvenido de nuevo, socio</p>
                    <h2 className="text-2xl font-bold text-white mt-6">Iniciar Sesión</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">Tu Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-600" size={16} />
                            <input required name="email" autoComplete="email" type="email" placeholder="tu@email.com"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 pl-10 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">Contraseña</label>
                        <div className="relative">
                            <input required name="password" autoComplete="current-password" type={verPassword ? "text" : "password"} placeholder="••••"
                                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 pr-10 text-white outline-none focus:border-yellow-500 transition-all text-sm"
                                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <button type="button" onClick={() => setVerPassword(!verPassword)} className="absolute right-3 top-3 text-gray-600 hover:text-yellow-500 cursor-pointer">
                                {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-95">
                        {loading ? 'Entrando...' : 'Entrar al Panel'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">¿No tienes cuenta? <Link to="/registro" className="text-yellow-500 font-bold hover:underline">Regístrate aquí</Link></p>
                </div>

                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#1c1c1c] px-4 text-gray-500 font-bold">O entra con</span></div>
                </div>

                <button onClick={handleGoogle} className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Google
                </button>
            </div>
        </div>
    )
}