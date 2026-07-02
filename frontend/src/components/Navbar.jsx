import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // <-- Importamos sus estilos aislados

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                MOTIVA - ERP
            </div>
            <div className="navbar-links">
                <Link to="/" className="navbar-link">Inventario</Link>
                <Link to="/nueva-venta" className="navbar-link">Registrar Venta</Link>
                <Link to="/reportes" className="navbar-link">Reportes</Link>
            </div>
        </nav>
    );
};

export default Navbar;