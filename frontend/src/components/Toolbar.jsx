import React from 'react';
import { Search, ArrowUpDown, Undo2 } from 'lucide-react';

export default function Toolbar({ searchTerm, setSearchTerm, sortBy, setSortBy, lastAction, handleUndo }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                {/* Buscador */}
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '8px 8px 8px 36px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Selector de Orden */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <ArrowUpDown size={18} color="#9ca3af" style={{ position: 'absolute', left: '10px' }} />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: '8px 12px 8px 34px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="newest">Últimos cargados</option>
                        <option value="stock_asc">Menor Stock</option>
                        <option value="stock_desc">Mayor Stock</option>
                        <option value="price_asc">Menor Precio</option>
                        <option value="price_desc">Mayor Precio</option>
                    </select>
                </div>
            </div>
        </div>
    );
}