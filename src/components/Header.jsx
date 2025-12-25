// src/components/Header.jsx
export default function Header({ nombreRestaurante, email }) { // <-- Añadimos nombreRestaurante
    return (
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
            <div>
                {/* Ahora usamos la variable en lugar de texto fijo */}
                <h1 className="text-2xl font-bold text-yellow-500">{nombreRestaurante || 'Cargando...'}</h1>
                <p className="text-xs text-gray-500 font-medium">Panel de Control</p>
            </div>
            {/* ... el resto del código igual ... */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">{email}</span>
                {/* ... botón de cerrar sesión ... */}
            </div>
        </div>
    )
}