import React from 'react';
import styles from './ProductForm.module.css'; // Importamos el archivo de estilos modulares

export default function ProductForm({ formData, handleChange, handleSubmit, error }) {
    return (
        <section className={styles.formSection}>
            <h2 className={styles.formTitle}>Cargar nuevo artículo</h2>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.productForm}>
                <input type="text" name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} required className={styles.inputField} />
                <input type="text" name="name" placeholder="Prenda" value={formData.name} onChange={handleChange} required className={styles.inputField} />
                <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} required className={styles.inputField} />
                <input type="text" name="size" placeholder="Talle" value={formData.size} onChange={handleChange} required className={styles.inputField} />
                <input type="number" name="price" placeholder="Precio ($)" value={formData.price} onChange={handleChange} required className={styles.inputField} />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required className={styles.inputField} />
                <input type="number" name="minStock" placeholder="Min" value={formData.minStock} onChange={handleChange} required className={styles.inputField} />

                <button type="submit" className={styles.submitButton}>
                    Añadir al Inventario
                </button>
            </form>
        </section>
    );
}