import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

// PÁGINAS
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Login from './pages/Login'
import Registro from './pages/Registro'
import DashboardPrincipal from './pages/DashboardPrincipal'
import Categorias from './pages/Categorias'
import Productos from './pages/Productos'
import Pedidos from './pages/Pedidos'
import Cupones from './pages/Cupones'
import MensajesBot from './pages/MensajesBot'
import Ventas from './pages/Ventas'
import Calificaciones from './pages/Calificaciones'
import Restaurante from './pages/Restaurante'
import OnboardingRestaurante from './pages/OnboardingRestaurante'

function App() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [datosRestaurante, setDatosRestaurante] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) checkRestaurante(session.user.id)
            else setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) checkRestaurante(session.user.id)
            else {
                setDatosRestaurante(null)
                setLoading(false)
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const checkRestaurante = async (userId) => {
        const { data } = await supabase.from('restaurantes').select('*').eq('user_id', userId).single()
        setDatosRestaurante(data || null)
        setLoading(false)
    }

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-yellow-500 font-bold italic text-2xl">Maikitto...</div>

    return (
        <Routes>
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
            <Route path="/registro" element={!session ? <Registro /> : <Navigate to="/" />} />

            <Route path="/*" element={
                session ? (
                    !datosRestaurante ? (
                        <OnboardingRestaurante userId={session.user.id} userEmail={session.user.email} alTerminar={() => checkRestaurante(session.user.id)} />
                    ) : (
                        <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
                            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                                <Header nombreRestaurante={datosRestaurante.nombre_restaurante} email={session.user.email} />

                                {activeTab === 'Dashboard' && <DashboardPrincipal restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Categorias' && <Categorias restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Productos' && <Productos restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Pedidos' && <Pedidos restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Ventas' && <Ventas restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Cupones' && <Cupones restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Mensajes' && <MensajesBot restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Calificaciones' && <Calificaciones restauranteId={datosRestaurante.id} />}
                                {activeTab === 'Restaurante' && (
                                    <Restaurante
                                        restauranteId={datosRestaurante.id}
                                        alActualizar={() => checkRestaurante(session.user.id)}
                                    />
                                )}
                            </main>
                        </div>
                    )
                ) : (<Navigate to="/login" replace />)
            }
            />
        </Routes>
    )
}
export default App