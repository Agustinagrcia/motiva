const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Tu link directo de Mongo Atlas
const uri = "mongodb+srv://agustinagarciar:%40motivada2003@motiva.yfywoku.mongodb.net/erp?retryWrites=true&w=majority&appName=Motiva";
const client = new MongoClient(uri);

let db, productsCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('erp');
    productsCollection = db.collection('Product');
    console.log("🔌 Conectado con éxito a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
}
connectDB();

// 1. Ver todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await productsCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al traer productos" });
  }
});

// 2. Crear un producto nuevo (Ahora recibe el precio directo del Excel)
app.post('/api/products', async (req, res) => {
  try {
    const { sku, name, color, size, price, stock, minStock } = req.body;
    
    const existing = await productsCollection.findOne({ sku });
    if (existing) {
      return res.status(400).json({ error: "El SKU ya existe" });
    }

    const newProduct = {
      sku, name, color, size,
      price: Number(price),
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 3,
      createdAt: new Date()
    };

    const result = await productsCollection.insertOne(newProduct);
    res.json({ id: result.insertedId, ...newProduct });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// 3. Sumar o restar stock
app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { stock: Number(quantity) } },
      { returnDocument: 'after' }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al modificar stock" });
  }
});

// 4. ELIMINAR UN PRODUCTO (La ruta que nos faltaba)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await productsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

// 5. EDITAR UN PRODUCTO EXISTENTE POR COMPLETO
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, size, price, stock, minStock } = req.body;

    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          name, 
          color, 
          size, 
          price: Number(price), 
          stock: Number(stock), 
          minStock: Number(minStock) 
        } 
      },
      { returnDocument: 'after' }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

app.listen(3001, () => console.log('🚀 Servidor Express en JS listo en http://localhost:3001'));