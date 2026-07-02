const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// Función auxiliar para tener la colección a mano
const getCollection = () => getDB().collection('Product');

// 1. Ver todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await getCollection().find({}).sort({ createdAt: -1 }).toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al traer productos" });
    }
});

// 2. Crear un producto nuevo
router.post('/', async (req, res) => {
    try {
        const { sku, name, color, size, price, stock, minStock } = req.body;
        const collection = getCollection();

        const existing = await collection.findOne({ sku });
        if (existing) return res.status(400).json({ error: "El SKU ya existe" });

        const newProduct = {
            sku, name, color, size,
            price: Number(price),
            stock: Number(stock) || 0,
            minStock: Number(minStock) || 3,
            createdAt: new Date()
        };

        const result = await collection.insertOne(newProduct);
        res.json({ id: result.insertedId, ...newProduct });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

// 3. Sumar o restar stock (Uso manual)
router.patch('/:id/stock', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const result = await getCollection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $inc: { stock: Number(quantity) } },
            { returnDocument: 'after' }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error al modificar stock" });
    }
});

// 4. Eliminar producto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await getCollection().deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

// 5. Editar producto por completo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color, size, price, stock, minStock } = req.body;

        const result = await getCollection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { name, color, size, price: Number(price), stock: Number(stock), minStock: Number(minStock) } },
            { returnDocument: 'after' }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

module.exports = router;