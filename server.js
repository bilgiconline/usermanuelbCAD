const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Middleware
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

// API Routes - İçerik görüntüleme
app.get('/api/contents', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'public/data/contents.json'), 'utf8');
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
        const data = await fs.readFile(path.join(__dirname, 'public/data/contents.json'), 'utf8');
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

// Tüm rotaları ana sayfaya yönlendir
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/documentation.html'));
});

module.exports = app; 