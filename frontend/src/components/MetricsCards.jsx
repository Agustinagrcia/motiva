import React from 'react';
import { Layers, DollarSign, AlertTriangle } from 'lucide-react';
import styles from './MetricsCards.module.css'; // Importación del módulo CSS

export default function MetricsCards({ totalStock, totalValue, totalCritical }) {
    return (
        <div className={styles.gridContainer}>

            {/* Tarjeta: Stock */}
            <div className={styles.card}>
                <div className={`${styles.iconWrapper} ${styles.iconStock}`}>
                    <Layers size={18} />
                </div>
                <div>
                    <p className={styles.cardLabel}>Stock Total</p>
                    <h3 className={styles.cardValue}>{totalStock} u.</h3>
                </div>
            </div>

            {/* Tarjeta: Valor */}
            <div className={styles.card}>
                <div className={`${styles.iconWrapper} ${styles.iconValue}`}>
                    <DollarSign size={18} />
                </div>
                <div>
                    <p className={styles.cardLabel}>Valor Inventario</p>
                    <h3 className={styles.cardValue}>$ {totalValue.toLocaleString()}</h3>
                </div>
            </div>

            {/* Tarjeta: Críticos */}
            <div className={styles.card}>
                <div className={`
          ${styles.iconWrapper} 
          ${totalCritical > 0 ? styles.iconCriticalAlert : styles.iconCriticalNormal}
        `}>
                    <AlertTriangle size={18} />
                </div>
                <div>
                    <p className={styles.cardLabel}>Críticos</p>
                    <h3 className={`
            ${styles.cardValue} 
            {totalCritical > 0 ? styles.cardValueAlert : ''}
          `}>
                        {totalCritical}
                    </h3>
                </div>
            </div>

        </div>
    );
}