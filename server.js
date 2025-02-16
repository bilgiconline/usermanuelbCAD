const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;
const app = express();

// Vercel için dosya sistemi yollarını düzenle
const CONTENTS_FILE = path.join(process.cwd(), 'public/data/contents.json');

// Multer ayarları - Vercel için in-memory storage kullan
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/contents', async (req, res) => {
    try {
        const data = await fs.readFile(CONTENTS_FILE, 'utf8');
        const contents = JSON.parse(data);
        res.json(contents);
    } catch (error) {
        console.error('İçerik okuma hatası:', error);
        res.status(500).json({ error: 'İçerikler yüklenemedi' });
    }
});

// Diğer route'lar için catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Vercel için module.exports ekle
if (process.env.VERCEL) {
    module.exports = app;
} else {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
} 