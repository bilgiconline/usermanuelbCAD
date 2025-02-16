document.addEventListener('DOMContentLoaded', function() {
    // Menü toggle fonksiyonu
    const menuItems = document.querySelectorAll('.menu-item span');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const submenu = this.nextElementSibling;
            submenu.classList.toggle('active');
        });
    });

    // Mobil menü toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    document.body.appendChild(menuToggle);

    menuToggle.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // İçerikleri yükle ve mevcut menü yapısıyla birleştir
    async function loadContents() {
        try {
            const response = await fetch('/api/contents');
            const contents = await response.json();
            
            // İçerikleri kategorilere göre grupla
            const contentsByCategory = {};
            contents.forEach(item => {
                if (!contentsByCategory[item.category]) {
                    contentsByCategory[item.category] = [];
                }
                contentsByCategory[item.category].push(item);
            });

            // Her kategori için içerikleri ilgili menüye ekle
            Object.entries(contentsByCategory).forEach(([category, items]) => {
                const categoryMap = {
                    'baslangic': '🎯 Başlangıç',
                    'temel-cizimler': '📝 Temel Çizimler',
                    'kopyalama': '🔄 Kopyalama İşlemleri',
                    'araclar': '🔧 Araçlar',
                    'ipuclari': '💡 İpuçları'
                };

                // İlgili menü öğesini bul
                const menuItem = Array.from(document.querySelectorAll('.menu-item span')).find(
                    span => span.textContent.includes(categoryMap[category])
                );

                if (menuItem) {
                    const submenu = menuItem.nextElementSibling;
                    // Dinamik içerikleri mevcut menüye ekle
                    items.forEach(item => {
                        const li = document.createElement('li');
                        li.setAttribute('data-content-id', item.id);
                        li.textContent = item.title;
                        li.addEventListener('click', (e) => {
                            e.preventDefault();
                            loadDynamicContent(item);
                        });
                        submenu.appendChild(li);
                    });
                }
            });
        } catch (error) {
            console.error('İçerikler yüklenirken hata:', error);
        }
    }

    // Dinamik içeriği yükle
    function loadDynamicContent(content) {
        const contentBody = document.querySelector('.content-body');
        contentBody.innerHTML = `
            <div class="doc-section">
                <h2>${content.title}</h2>
                ${content.content}
            </div>
        `;
        // URL'i güncelle
        history.pushState({}, '', `/contents/${content.id}`);
    }

    // URL'den içerik yükleme (mevcut statik sayfalar için)
    function loadStaticContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.querySelector('.content-body').innerHTML = html;
            })
            .catch(error => {
                console.error('İçerik yüklenirken hata:', error);
            });
    }

    // Menü linklerini dinleme
    document.querySelectorAll('.submenu li').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            const contentId = this.getAttribute('data-content-id');
            
            if (contentId) {
                // Dinamik içerik
                fetch(`/api/contents/${contentId}`)
                    .then(res => res.json())
                    .then(content => loadDynamicContent(content))
                    .catch(error => console.error('İçerik yüklenirken hata:', error));
            } else if (url) {
                // Statik içerik
                loadStaticContent(url);
                history.pushState({}, '', url);
            }
        });
    });

    // Sayfa yüklendiğinde içerikleri yükle
    loadContents();

    // Tema değiştirme fonksiyonu
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Kullanıcının tercih ettiği temayı local storage'dan al
    const currentTheme = localStorage.getItem('theme');
    
    // Sayfa yüklendiğinde tema tercihi varsa uygula
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    } else if (prefersDarkScheme.matches) {
        // Sistem teması karanlıksa ve kullanıcı tercihi yoksa karanlık tema uygula
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    // Tema değiştirme butonu tıklama olayı
    themeToggle.addEventListener('click', function() {
        let theme = 'light';
        
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            theme = 'dark';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    // Tema ikonunu güncelle
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('.icon');
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // Sistem teması değişikliğini dinle
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            updateThemeIcon(theme);
        }
    });

    // Arama fonksiyonu
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('.doc-section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
}); 