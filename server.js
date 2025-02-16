const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 3000;

// Önce tüm middleware'leri tanımla
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar için klasör tanımlama
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Multer ayarlarını düzelt
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Güvenli dosya adı oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) => {
    // Sadece resim dosyalarına izin ver
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
};

// Multer instance'ını oluştur
const uploadMiddleware = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Form data için ayrı bir middleware
const formDataMiddleware = multer().none();

// Port kontrolü ve alternatif port bulma
const startServer = (attemptPort) => {
    app.listen(attemptPort)
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${attemptPort} kullanımda, ${attemptPort + 1} deneniyor...`);
                startServer(attemptPort + 1);
            }
        })
        .on('listening', () => {
            console.log(`✨ Dokümantasyon sunucusu http://localhost:${attemptPort} adresinde çalışıyor`);
            console.log('📝 Ctrl + C ile sunucuyu kapatabilirsiniz');
        });
};

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'documentation.html'));
});

// /docs/ altındaki sayfalar için yönlendirme
app.get('/docs/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'docs', `${page}.html`));
});

// Admin panel yönlendirmesi
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// İçerik dosyası yolu
const CONTENTS_FILE = path.join(__dirname, 'public/data/contents.json');

// İçerikleri getir
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

// Tekil içerik getir
app.get('/api/contents/:id', async (req, res) => {
    try {
        const data = await fs.readFile(CONTENTS_FILE, 'utf8');
        const contents = JSON.parse(data);
        const content = contents.find(c => c.id === req.params.id);
        
        if (!content) {
            return res.status(404).json({ error: 'İçerik bulunamadı' });
        }

        // İçeriği string'e çevir
        if (Array.isArray(content.content)) {
            content.content = content.content.join('');
        }
        
        res.json(content);
    } catch (error) {
        console.error('İçerik okuma hatası:', error);
        res.status(500).json({ error: 'İçerik yüklenemedi' });
    }
});

// İçerik güncelle
app.put('/api/contents/:id', async (req, res) => {
    try {
        const data = await fs.readFile(CONTENTS_FILE, 'utf8');
        let contents = JSON.parse(data);
        
        const index = contents.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'İçerik bulunamadı' });
        }

        // Gelen içeriği işle
        const updatedContent = {
            ...contents[index],
            title: req.body.title,
            category: req.body.category,
            content: req.body.content,
            updatedAt: new Date().toISOString()
        };
        
        contents[index] = updatedContent;
        await fs.writeFile(CONTENTS_FILE, JSON.stringify(contents, null, 2));
        res.json(updatedContent);
    } catch (error) {
        console.error('İçerik güncelleme hatası:', error);
        res.status(500).json({ error: 'İçerik güncellenemedi' });
    }
});

// Yeni içerik ekle
app.post('/api/contents', async (req, res) => {
    try {
        const data = await fs.readFile(CONTENTS_FILE, 'utf8');
        const contents = JSON.parse(data);
        
        const newContent = {
            id: Date.now().toString(),
            title: req.body.title,
            category: req.body.category,
            content: req.body.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        contents.push(newContent);
        await fs.writeFile(CONTENTS_FILE, JSON.stringify(contents, null, 2));
        res.status(201).json(newContent);
    } catch (error) {
        console.error('İçerik ekleme hatası:', error);
        res.status(500).json({ error: 'İçerik eklenemedi' });
    }
});

// İçerik sil
app.delete('/api/contents/:id', async (req, res) => {
    try {
        const data = await fs.readFile(CONTENTS_FILE, 'utf8');
        let contents = JSON.parse(data);
        
        contents = contents.filter(c => c.id !== req.params.id);
        await fs.writeFile(CONTENTS_FILE, JSON.stringify(contents, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('İçerik silme hatası:', error);
        res.status(500).json({ error: 'İçerik silinemedi' });
    }
});

// Resim yükleme endpoint'i
app.post('/upload-image', uploadMiddleware.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Dosya yüklenemedi' });
    }

    // Dosya yüklendi, URL'ini döndür
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
        location: imageUrl // TinyMCE bu property'yi bekliyor
    });
});

// Dinamik içerik yönlendirmesi
app.get('/contents/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'documentation.html'));
});

// 404 sayfası
app.use((req, res) => {
    res.status(404).send(`
        <h1>Sayfa Bulunamadı</h1>
        <p>Aradığınız sayfa bulunamadı.</p>
        <a href="/">Ana Sayfaya Dön</a>
    `);
});

// Uploads klasörünü kontrol et ve oluştur
const ensureUploadsDir = async () => {
    try {
        await fs.access('uploads');
    } catch {
        await fs.mkdir('uploads');
    }
};

// Sunucu başlatılmadan önce klasörleri kontrol et
(async () => {
    await ensureUploadsDir();
    startServer(port);
})();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 Sunucu kapatılıyor...');
    process.exit(0);
}); 