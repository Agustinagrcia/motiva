import React from 'react';
import { AlertTriangle, Check, X, Pencil, Trash2, Undo2 } from 'lucide-react';
import styles from './ProductTable.module.css'

export default function ProductsTable({
    products,
    editingId,
    editRowData,
    handleEditRowChange,
    startEdit,
    saveRowEdit,
    cancelEdit,
    handleDeleteProduct,
    lastAction,
    handleUndo,
    totalValue
}) {
    return (
        <section className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.headerRow}>
                        <th className={styles.headerCell}>SKU</th>
                        <th className={styles.headerCell}>Prenda</th>
                        <th className={styles.headerCell}>Color</th>
                        <th className={styles.headerCell}>Talle</th>
                        <th className={styles.headerCell}>Precio Venta</th>
                        <th className={`${styles.headerCell} ${styles.center}`}>Stock</th>
                        <th className={styles.headerCell}>Estado</th>
                        <th className={`${styles.headerCell} ${styles.center}`}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="8" className={styles.empty}>
                                No hay artículos.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => {
                            const id = product._id || product.id;
                            const isEditing = editingId === id;
                            const isLowStock = product.stock <= product.minStock;
                            const hasUndoAvailable = lastAction && lastAction.id === id;
                            const isDeletedView = product._isDeletedBackup;

                            const rowClassName = [
                                styles.row,
                                isLowStock && styles.lowStockRow,
                                isDeletedView && styles.deletedRow,
                            ]
                                .filter(Boolean)
                                .join(" ");

                            return (
                                <tr key={id} className={rowClassName}>
                                    <td className={styles.cell}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="sku"
                                                value={editRowData.sku || ""}
                                                onChange={handleEditRowChange}
                                                className={styles.input}
                                            />
                                        ) : (
                                            product.sku
                                        )}
                                    </td>
                                    {/* Prenda */}
                                    <td className={`${styles.cell} ${styles.productName}`}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editRowData.name || ""}
                                                onChange={handleEditRowChange}
                                                className={styles.input}
                                            />
                                        ) : (
                                            product.name
                                        )}
                                    </td>
                                    {/* Color */}
                                    <td className={styles.cell}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="color"
                                                value={editRowData.color || ""}
                                                onChange={handleEditRowChange}
                                                className={styles.input}
                                            />
                                        ) : (
                                            product.color || "-"
                                        )}
                                    </td>
                                    {/* Talle */}
                                    <td className={styles.cell}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="size"
                                                value={editRowData.size || ""}
                                                onChange={handleEditRowChange}
                                                className={styles.input}
                                            />
                                        ) : (
                                            product.size || "-"
                                        )}
                                    </td>
                                    {/* Precio */}
                                    <td className={styles.cell}>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="price"
                                                value={editRowData.price || ""}
                                                onChange={handleEditRowChange}
                                                className={styles.input}
                                            />
                                        ) : (
                                            `$ ${product.price}`
                                        )}
                                    </td>
                                    {/* Stock */}
                                    <td className={`${styles.cell} ${styles.center}`}>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="stock"
                                                value={editRowData.stock || ""}
                                                onChange={handleEditRowChange}
                                                className={`${styles.input} ${styles.center}`}
                                            />
                                        ) : (
                                            <span className={styles.stock}>{product.stock}</span>
                                        )}
                                    </td>
                                    {/* Estado */}
                                    <td className={styles.cell}>
                                        {isDeletedView ? (
                                            <span className={styles.deleted}>Eliminado</span>
                                        ) : isLowStock ? (
                                            <span className={styles.lowStock}>
                                                <AlertTriangle size={10} />
                                                Crítico
                                            </span>
                                        ) : (
                                            <span className={styles.ok}>✓ OK</span>
                                        )}
                                    </td>
                                    {/* Acciones */}
                                    <td className={`${styles.cell} ${styles.center}`}>
                                        <div className={styles.actions}>
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => saveRowEdit(id)}
                                                        className={`${styles.iconButton} ${styles.success}`}
                                                        title="Guardar"
                                                    >
                                                        <Check size={16} />
                                                    </button>

                                                    <button
                                                        onClick={cancelEdit}
                                                        className={`${styles.iconButton} ${styles.danger}`}
                                                        title="Cancelar"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : isDeletedView ? (
                                                // Vista de papelera: SOLO el botoncito de la flecha, sin texto
                                                <button
                                                    onClick={handleUndo}
                                                    className={`${styles.iconButton} ${styles.muted}`}
                                                    title="Restaurar"
                                                >
                                                    <Undo2 size={16} />
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(product)}
                                                        className={`${styles.iconButton} ${styles.primary}`}
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteProduct(id)}
                                                        className={`${styles.iconButton} ${styles.danger}`}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    {/* Si se editó y quieres la opción de volver atrás, también solo el ícono */}
                                                    {hasUndoAvailable && lastAction.type === "EDIT" && (
                                                        <button
                                                            onClick={handleUndo}
                                                            className={`${styles.iconButton} ${styles.muted}`}
                                                            title="Deshacer edición"
                                                        >
                                                            <Undo2 size={16} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </section>
    );
}