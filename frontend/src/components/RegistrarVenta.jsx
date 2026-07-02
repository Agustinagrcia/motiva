import React, { useState, useEffect } from 'react';
import './RegistrarVenta.css'; // <-- Importamos tus estilos limpios acá

const RegistrarVenta = ({ onVentaExitosa }) => {
    const obtenerFechaHoy = () => {
        const hoy = new Date();
        const offset = hoy.getTimezoneOffset();
        const fechaLocal = new Date(hoy.getTime() - (offset * 60 * 1000));
        return fechaLocal.toISOString().split('T')[0];
    };

    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);

    const [fecha, setFecha] = useState(obtenerFechaHoy());
    const [clientName, setClientName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [soldBy, setSoldBy] = useState('');
    const [amountPaid, setAmountPaid] = useState('');

    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const respuesta = await fetch('http://localhost:3001/api/products');
                const datos = await respuesta.json();
                setProductos(datos);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };
        obtenerProductos();
    }, []);

    const prodEncontrado = productos.find(p => p._id === productoSeleccionado);
    const totalEnTiempoReal = prodEncontrado ? prodEncontrado.price * cantidad : 0;

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!productoSeleccionado || cantidad <= 0) {
            setMensaje({ texto: 'Por favor, selecciona un producto y una cantidad válida.', tipo: 'error' });
            return;
        }

        setCargando(true);
        setMensaje({ texto: '', tipo: '' });

        try {
            const respuesta = await fetch('http://localhost:3001/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: productoSeleccionado,
                    quantity: Number(cantidad),
                    date: fecha,
                    clientName,
                    paymentMethod,
                    soldBy,
                    amountPaid: Number(amountPaid) || totalEnTiempoReal
                })
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                setMensaje({ texto: '¡Venta registrada y stock descontado con éxito!', tipo: 'exito' });
                setCantidad(1);
                setProductoSeleccionado('');
                setClientName('');
                setSoldBy('');
                setAmountPaid('');
                setFecha(obtenerFechaHoy());

                if (onVentaExitosa) onVentaExitosa();
            } else {
                setMensaje({ texto: resultado.error || 'Error al procesar la venta.', tipo: 'error' });
            }
        } catch (error) {
            setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="sale-card">
            <h3 className="sale-title">Registrar nueva venta</h3>

            <form onSubmit={manejarEnvio}>

                {/* Fecha */}
                <div className="form-group">
                    <label>Fecha de Venta:</label>
                    <input
                        type="date"
                        className="form-input"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </div>

                {/* Selector de Producto */}
                <div className="form-group">
                    <label>Producto (Artículo):</label>
                    <select
                        className="form-select"
                        value={productoSeleccionado}
                        onChange={(e) => setProductoSeleccionado(e.target.value)}
                    >
                        <option value="">-- Selecciona un artículo --</option>
                        {productos.map((prod) => (
                            <option key={prod._id} value={prod._id}>
                                {prod.name} ({prod.color} - Talle {prod.size}) | Stock: {prod.stock}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cantidad */}
                <div className="form-group">
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        min="1"
                        className="form-input"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                    />
                </div>

                {/* Nombre del Cliente */}
                <div className="form-group">
                    <label>Nombre del Cliente:</label>
                    <input
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        className="form-input"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                </div>

                {/* Método de Pago */}
                <div className="form-group">
                    <label>Método de Pago:</label>
                    <select
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                    </select>
                </div>

                {/* Vendido por */}
                <div className="form-group">
                    <label>Vendido por:</label>
                    <input
                        type="text"
                        placeholder="Nombre del vendedor"
                        className="form-input"
                        value={soldBy}
                        onChange={(e) => setSoldBy(e.target.value)}
                    />
                </div>

                {/* Cuánto abonó */}
                <div className="form-group">
                    <label>Monto Abonado ($):</label>
                    <input
                        type="number"
                        placeholder={`Total sugerido: $${totalEnTiempoReal}`}
                        className="form-input"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                    />
                </div>

                {/* TOTAL DE ESTA VENTA */}
                <div className="sale-total-box">
                    Total a Facturar: ${totalEnTiempoReal}
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="btn-submit"
                    disabled={cargando}
                >
                    {cargando ? 'Procesando...' : 'Confirmar y Registrar Venta'}
                </button>
            </form>

            {/* Alertas */}
            {mensaje.texto && (
                <div className={`alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-error'}`}>
                    {mensaje.texto}
                </div>
            )}
        </div>
    );
};

export default RegistrarVenta;