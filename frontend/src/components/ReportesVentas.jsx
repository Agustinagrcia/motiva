import React, { useState, useEffect } from 'react';
import './ReportesVentas.css';

const ReportesVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Estados para filtros
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAnio, setFiltroAnio] = useState('');

    useEffect(() => {
        obtenerHistorial();
    }, []);

    const obtenerHistorial = async () => {
        try {
            // Usamos la variable de entorno en lugar de localhost
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales`);

            if (!response.ok) throw new Error('Error en la respuesta del servidor');

            const data = await response.json();
            setVentas(data);
        } catch (err) {
            console.error("Error al traer historial:", err);
        } finally {
            setCargando(false);
        }
    };
    const handleEliminar = async (id) => {
        // 1. Verificación básica
        if (!id) {
            console.error("Error: ID inválido", id);
            return;
        }

        if (!window.confirm("¿Segura? Se borrará la venta y se devolverá el stock al inventario.")) return;

        try {
            // 2. Usamos la variable de entorno para que apunte a tu servidor (local o en la nube)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            // 3. Manejo de respuesta
            if (res.ok) {
                setVentas(ventas.filter(v => v._id !== id));
            } else {
                const errorData = await res.text();
                console.error("Respuesta del servidor al eliminar:", errorData);
                alert("Error al eliminar. Revisa la consola (F12).");
            }
        } catch (err) {
            // Si el fetch falla (por ejemplo, porque el servidor está apagado), entrará aquí
            console.error("Error de red o conexión:", err);
            alert("No se pudo conectar con el servidor. Verifica que esté encendido.");
        }
    };
    const ventasFiltradas = ventas.filter(venta => {
        const fecha = new Date(venta.date);
        const coincideMes = filtroMes === '' || (fecha.getMonth() + 1) === Number(filtroMes);
        const coincideAnio = filtroAnio === '' || fecha.getFullYear() === Number(filtroAnio);
        return coincideMes && coincideAnio;
    });

    if (cargando) return <div>Cargando historial...</div>;

    return (
        <div className="reports-container">
            <h2>Historial de Ventas</h2>

            {/* PANEL DE FILTROS */}
            <div className="filters-panel" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <select onChange={(e) => setFiltroMes(e.target.value)} value={filtroMes}>
                    <option value="">Todos los meses</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>Mes {m}</option>)}
                </select>

                <select onChange={(e) => setFiltroAnio(e.target.value)} value={filtroAnio}>
                    <option value="">Todos los años</option>
                    <option value="2026">2026</option>
                </select>
            </div>

            <p>Mostrando {ventasFiltradas.length} registros</p>

            <div className="table-wrapper">
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasFiltradas.map((item) => (
                            <tr key={item._id}>
                                <td>{new Date(item.date).toLocaleDateString('es-AR')}</td>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td className="row-total">${item.total?.toLocaleString('es-AR')}</td>
                                <td>
                                    <button
                                        onClick={() => handleEliminar(item._id)}
                                        className="btn-delete"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportesVentas;