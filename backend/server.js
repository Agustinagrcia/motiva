const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');


const app = express();
app.use(cors());
app.use(express.json());

// 1. Conectar a la base de datos antes de definir rutas
connectDB().then(() => {

    // 2. Definición de rutas (Middlewares)
    app.use('/api/products', productRoutes);
    app.use('/api/sales', saleRoutes);

    // 3. Encendido del servidor
// Usamos process.env.PORT que es lo que inyecta el servidor en la nube
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en el puerto ${PORT}`);
});
});