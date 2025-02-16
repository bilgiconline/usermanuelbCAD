const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Vercel için dosya sistemi yollarını düzenle
const CONTENTS_FILE = path.join(process.cwd(), 'public/data/contents.json');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes - Sadece içerik görüntüleme
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

// Tekil içerik görüntüleme
app.get('/api/contents/:id', async (req, res) => {
    try {
        const data = await fs.readFile(CONTENTS_FILE, 'utf8');
        const contents = JSON.parse(data);
        const content = contents.find(c => c.id === req.params.id);
        
        if (!content) {
            return res.status(404).json({ error: 'İçerik bulunamadı' });
        }
        
        res.json(content);
    } catch (error) {
        console.error('İçerik okuma hatası:', error);
        res.status(500).json({ error: 'İçerik yüklenemedi' });
    }
});

// Ana sayfa ve diğer route'lar için
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Vercel için module.exports
if (process.env.VERCEL) {
    module.exports = app;
} else {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
} 