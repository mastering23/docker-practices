const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017';
const DB_NAME = 'tasksdb';
let db;


MongoClient.connect(MONGO_URL)
  .then(client => {
    console.log('✅ Conectado a MongoDB');
    db = client.db(DB_NAME);
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// Rutas

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await db.collection('tasks').find().toArray();
    res.json(tasks);
    console.log("test 2");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/tasks', async (req, res) => {
  try {
    const { text, completed } = req.body;
    const newTask = {
      text,
      completed: completed || false,
      createdAt: new Date()
    };
    
    const result = await db.collection('tasks').insertOne(newTask);
    res.status(201).json({ ...newTask, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed } }
    );
    
    res.json({ message: 'Tarea actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
