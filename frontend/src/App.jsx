import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import MetricsCards from './components/MetricsCards';
import ProductForm from './components/ProductForm';
import Toolbar from './components/Toolbar';
import ProductTable from './components/ProductTable';

export default function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ sku: '', name: '', color: '', size: '', price: '', stock: '', minStock: '' });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [editingId, setEditingId] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [lastAction, setLastAction] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error al conectar con el backend:", err);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleEditRowChange = (e) => setEditRowData({ ...editRowData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const skuExiste = products.some(p => p.sku?.toLowerCase().trim() === formData.sku?.toLowerCase().trim());
    if (skuExiste) {
      setError("❌ ¡Ojo! Este SKU ya existe en el inventario.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ sku: '', name: '', color: '', size: '', price: '', stock: '', minStock: '' });
        setLastAction(null);
        fetchProducts();
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id || product.id);
    setEditRowData({ ...product });
  };

  const cancelEdit = () => { 
    setEditingId(null); 
    setEditRowData({}); 
  };

  const saveRowEdit = async (id) => {
    const originalProduct = products.find(p => (p._id || p.id) === id);
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRowData)
      });
      if (res.ok) {
        setLastAction({ type: 'EDIT', id, backupData: { ...originalProduct } });
        setEditingId(null);
        fetchProducts();
      }
    } catch (err) { 
      console.error("Error al editar", err); 
    }
  };

  const handleDeleteProduct = async (id) => {
    const productToDelete = products.find(p => (p._id || p.id) === id);
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLastAction({ type: 'DELETE', id, backupData: { ...productToDelete } });
        fetchProducts();
      }
    } catch (err) { 
      console.error("Error al eliminar", err); 
    }
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    try {
      if (lastAction.type === 'DELETE') {
        await fetch('http://localhost:3001/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lastAction.backupData)
        });
      } else if (lastAction.type === 'EDIT') {
        await fetch(`http://localhost:3001/api/products/${lastAction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lastAction.backupData)
        });
      }
      setLastAction(null);
      fetchProducts();
    } catch (err) { 
      console.error("Error al deshacer", err); 
    }
  };

  // Lógica de filtrado y ordenamiento
  const displayProducts = [...products];
  if (lastAction && lastAction.type === 'DELETE' && !products.some(p => (p._id || p.id) === lastAction.id)) {
    displayProducts.push({ ...lastAction.backupData, _isDeletedBackup: true });
  }

  const filteredAndSortedProducts = displayProducts
    .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a._isDeletedBackup) return -1;
      if (b._isDeletedBackup) return 1;
      if (sortBy === 'stock_asc') return a.stock - b.stock;
      if (sortBy === 'stock_desc') return b.stock - a.stock;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  const totalStock = filteredAndSortedProducts.reduce((acc, p) => acc + (p._isDeletedBackup ? 0 : Number(p.stock || 0)), 0);
  const totalValue = filteredAndSortedProducts.reduce((acc, p) => acc + (p._isDeletedBackup ? 0 : (Number(p.price || 0) * Number(p.stock || 0))), 0);
  const totalCritical = filteredAndSortedProducts.filter(p => !p._isDeletedBackup && p.stock <= p.minStock).length;

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', color: '#1f2937' }}>

      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Package size={26} color="#4f46e5" />
        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: '#10b981' }}>MOTIVA - Stock</h1>
      </header>

      <MetricsCards totalStock={totalStock} totalValue={totalValue} totalCritical={totalCritical} />

      <ProductForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} error={error} />

      <Toolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        lastAction={lastAction}
        handleUndo={handleUndo}
      />

      <ProductTable
        products={filteredAndSortedProducts}
        editingId={editingId}
        editRowData={editRowData}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        handleEditRowChange={handleEditRowChange}
        saveRowEdit={saveRowEdit}
        handleDeleteProduct={handleDeleteProduct}
        handleUndo={handleUndo}
        lastAction={lastAction}
        totalStock={totalStock}
        totalValue={totalValue}
      />
    </div>
  );
}