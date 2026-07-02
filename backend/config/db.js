const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://agustinagarciar:%40motivada2003@motiva.yfywoku.mongodb.net/erp?retryWrites=true&w=majority&appName=Motiva";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('erp');
    console.log("🔌 Conectado con éxito a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("La base de datos no ha sido inicializada. Llama a connectDB primero.");
  }
  return db;
}

module.exports = { connectDB, getDB };