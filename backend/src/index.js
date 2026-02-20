import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend vivo', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Backend One To One' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

export default app;