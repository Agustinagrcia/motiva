const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// RUTA GET: Obtener historial
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const salesHistory = await db.collection('Sales')
            .find({})
            .sort({ date: -1 })
            .toArray();
        res.json(salesHistory);
    } catch (error) {
        console.error("❌ Error al traer el historial:", error);
        res.status(500).json({ error: "Error al obtener el historial" });
    }
});

// RUTA POST: Registrar venta
router.post('/', async (req, res) => {
    try {
        const { productId, quantity, clientName, paymentMethod, soldBy, amountPaid, date } = req.body;
        const qtyToSell = Number(quantity);

        if (!productId || qtyToSell <= 0) {
            return res.status(400).json({ error: "Datos de venta inválidos" });
        }

        const db = getDB();
        const result = await db.collection('Product').findOneAndUpdate(
            { _id: new ObjectId(productId), stock: { $gte: qtyToSell } },
            { $inc: { stock: -qtyToSell } },
            { returnDocument: 'after' }
        );

        const productoModificado = result.value ? result.value : result;
        if (!productoModificado) {
            return res.status(400).json({ error: "No hay stock suficiente." });
        }

        const saleDate = date ? new Date(date) : new Date();
        const newSale = {
            date: saleDate,
            month: saleDate.getMonth() + 1,
            year: saleDate.getFullYear(),
            productId: new ObjectId(productId),
            productName: productoModificado.name,
            sku: productoModificado.sku,
            quantity: qtyToSell,
            unitPrice: productoModificado.price,
            total: productoModificado.price * qtyToSell,
            clientName: clientName || 'Consumidor Final',
            paymentMethod: paymentMethod || 'Efectivo',
            soldBy: soldBy || 'General',
            amountPaid: Number(amountPaid) || (productoModificado.price * qtyToSell)
        };

        const saleResult = await db.collection('Sales').insertOne(newSale);
        res.json({ message: "Venta registrada", saleId: saleResult.insertedId });
    } catch (error) {
        console.error("❌ Error en POST:", error);
        res.status(500).json({ error: "Error al registrar la venta" });
    }
});

// RUTA DELETE: Eliminar venta y devolver stock
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        
        const sale = await db.collection('Sales').findOne({ _id: new ObjectId(id) });
        if (!sale) return res.status(404).json({ error: "Venta no encontrada" });

        // Devolvemos el stock
        await db.collection('Product').updateOne(
            { _id: new ObjectId(sale.productId) },
            { $inc: { stock: sale.quantity } }
        );

        // Borramos la venta
        await db.collection('Sales').deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Venta eliminada y stock actualizado" });
    } catch (error) {
        console.error("❌ Error en DELETE:", error);
        res.status(500).json({ error: "Error al eliminar" });
    }
});

module.exports = router;