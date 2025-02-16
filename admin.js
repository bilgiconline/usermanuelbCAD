document.addEventListener('DOMContentLoaded', function() {
    const contentList = document.querySelector('.content-list');
    const editModal = document.querySelector('.edit-modal');
    const contentForm = document.getElementById('contentForm');
    
    // TinyMCE editörünü başlat
    tinymce.init({
        selector: '#editor',
        language: 'tr',
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: [
            'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify',
            'bullist numlist outdent indent | link image media',
            'quickstart stepcard videocontainer featuregrid | warningbox keyboardkey notebox codeblock',
            'removeformat | help'
        ].join(' | '),
        menubar: 'file edit view insert format tools table help',
        height: 500,
        content_style: `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                font-size: 16px; 
            }
            
            /* Klavye tuşu stili */
            kbd {
                display: inline-block;
                padding: 3px 6px;
                font-family: monospace;
                font-size: 0.875em;
                font-weight: 500;
                line-height: 1;
                color: #1e293b;
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                box-shadow: 0 1px 1px rgba(0,0,0,.12), 0 2px 0 0 #e2e8f0;
            }

            /* Uyarı kutuları */
            .warning-box, .error-box, .info-box, .tip-box {
                padding: 1rem 1.5rem;
                margin: 1.5rem 0;
                border-radius: 8px;
                position: relative;
                padding-left: 3.5rem;
            }

            .warning-box::before, .error-box::before, .info-box::before, .tip-box::before {
                position: absolute;
                left: 1rem;
                top: 1rem;
                font-size: 1.5rem;
            }

            .warning-box {
                background: rgba(251, 191, 36, 0.1);
                border-left: 4px solid #fbbf24;
            }

            .warning-box::before {
                content: '⚠️';
            }

            .error-box {
                background: rgba(239, 68, 68, 0.1);
                border-left: 4px solid #ef4444;
            }

            .error-box::before {
                content: '❌';
            }

            .info-box {
                background: rgba(59, 130, 246, 0.1);
                border-left: 4px solid #3b82f6;
            }

            .info-box::before {
                content: 'ℹ️';
            }

            .tip-box {
                background: rgba(34, 197, 94, 0.1);
                border-left: 4px solid #22c55e;
            }

            .tip-box::before {
                content: '💡';
            }

            /* Adım kartları için stiller */
            .quick-steps {
                margin: 2rem 0;
            }

            .step-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin: 1.5rem 0;
            }

            .step {
                background: var(--hover-background, #f1f5f9);
                padding: 1.5rem;
                border-radius: 8px;
                text-align: center;
                position: relative;
                border: 1px solid var(--border-color, #e2e8f0);
            }

            .step-number {
                background: var(--primary-color, #2563eb);
                color: white;
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
                font-weight: bold;
            }

            /* Video konteynır */
            .video-container {
                position: relative;
                padding-bottom: 56.25%; /* 16:9 oranı */
                height: 0;
                overflow: hidden;
                border-radius: 8px;
                margin: 1.5rem 0;
            }

            .video-container iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            }

            /* Özellik kartları */
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }

            .feature {
                background: var(--content-background, #ffffff);
                padding: 1.5rem;
                border-radius: 8px;
                border: 1px solid var(--border-color, #e2e8f0);
                transition: transform 0.2s ease;
            }

            .feature:hover {
                transform: translateY(-2px);
            }

            .feature h4 {
                color: var(--primary-color, #2563eb);
                margin-top: 0;
            }

            /* Kod bloğu */
            .code-block {
                background: var(--hover-background, #f1f5f9);
                padding: 1rem;
                border-radius: 8px;
                font-family: monospace;
                overflow-x: auto;
                border: 1px solid var(--border-color, #e2e8f0);
            }

            /* Not kutusu */
            .note-box {
                background: rgba(59, 130, 246, 0.1);
                border-left: 4px solid #3b82f6;
                padding: 1rem 1.5rem;
                margin: 1.5rem 0;
                border-radius: 0 8px 8px 0;
            }

            /* Karşılaştırma tablosu */
            .comparison-table {
                overflow-x: auto;
                margin: 2rem 0;
            }

            .comparison-table table {
                width: 100%;
                border-collapse: collapse;
            }

            .comparison-table th,
            .comparison-table td {
                padding: 1rem;
                border: 1px solid var(--border-color, #e2e8f0);
                text-align: left;
            }

            .comparison-table th {
                background: var(--hover-background, #f1f5f9);
                font-weight: 600;
            }

            .comparison-table tr:nth-child(even) {
                background: var(--hover-background, #f1f5f9);
            }
        `,
        images_upload_url: '/upload-image',
        automatic_uploads: true,
        images_reuse_filename: true,
        paste_data_images: true,
        relative_urls: false,
        convert_urls: false,
        branding: false,
        promotion: false,
        style_formats: [
            {
                title: 'Özel Bileşenler',
                items: [
                    {
                        title: 'Klavye Tuşu',
                        inline: 'kbd',
                        wrapper: true
                    },
                    {
                        title: 'Uyarı Kutusu',
                        block: 'div',
                        classes: 'warning-box',
                        wrapper: true
                    },
                    {
                        title: 'Hata Kutusu',
                        block: 'div',
                        classes: 'error-box',
                        wrapper: true
                    },
                    {
                        title: 'Bilgi Kutusu',
                        block: 'div',
                        classes: 'info-box',
                        wrapper: true
                    },
                    {
                        title: 'İpucu Kutusu',
                        block: 'div',
                        classes: 'tip-box',
                        wrapper: true
                    },
                    {
                        title: 'Adım Kartları Grid',
                        block: 'div',
                        classes: 'step-grid',
                        wrapper: true
                    },
                    {
                        title: 'Adım Kartı',
                        block: 'div',
                        classes: 'step',
                        wrapper: true
                    },
                    {
                        title: 'Adım Numarası',
                        block: 'div',
                        classes: 'step-number',
                        wrapper: true
                    },
                    {
                        title: 'Video Konteynır',
                        block: 'div',
                        classes: 'video-container',
                        wrapper: true
                    },
                    {
                        title: 'Özellik Kartları',
                        block: 'div',
                        classes: 'feature-grid',
                        wrapper: true
                    },
                    {
                        title: 'Özellik Kartı',
                        block: 'div',
                        classes: 'feature',
                        wrapper: true
                    },
                    {
                        title: 'Kod Bloğu',
                        block: 'pre',
                        classes: 'code-block',
                        wrapper: true
                    },
                    {
                        title: 'Not Kutusu',
                        block: 'div',
                        classes: 'note-box',
                        wrapper: true
                    },
                    {
                        title: 'Karşılaştırma Tablosu',
                        block: 'div',
                        classes: 'comparison-table',
                        wrapper: true
                    }
                ]
            }
        ],
        setup: function(editor) {
            editor.on('init', function() {
                editor.initialized = true;
                // Eğer bekleyen içerik varsa yükle
                if (editor._pendingContent) {
                    editor.setContent(editor._pendingContent);
                    delete editor._pendingContent;
                }
            });

            editor.on('change keyup', function() {
                updatePreview();
            });
            
            editor.ui.registry.addButton('warningbox', {
                text: '⚠️ Uyarı',
                onAction: function() {
                    editor.insertContent('<div class="warning-box"><p>Uyarı metni buraya...</p></div>');
                }
            });
            
            editor.ui.registry.addButton('keyboardkey', {
                text: '⌨️ Tuş',
                onAction: function() {
                    editor.insertContent('<kbd>Tuş</kbd>');
                }
            });

            // Hızlı başlangıç kartı ekleme butonu
            editor.ui.registry.addButton('quickstart', {
                text: '🚀 Hızlı Başlangıç',
                onAction: function() {
                    editor.insertContent(`
                        <div class="quick-steps">
                            <h3>🚀 Hızlı Başlangıç</h3>
                            <div class="step-grid">
                                <div class="step">
                                    <div class="step-number">1</div>
                                    <p>İlk adım açıklaması</p>
                                </div>
                                <div class="step">
                                    <div class="step-number">2</div>
                                    <p>İkinci adım açıklaması</p>
                                </div>
                                <div class="step">
                                    <div class="step-number">3</div>
                                    <p>Üçüncü adım açıklaması</p>
                                </div>
                            </div>
                        </div>
                    `);
                }
            });

            // Tekil adım kartı ekleme butonu
            editor.ui.registry.addButton('stepcard', {
                text: '📝 Adım Kartı',
                onAction: function() {
                    editor.insertContent(`
                        <div class="step">
                            <div class="step-number">1</div>
                            <p>Adım açıklaması</p>
                        </div>
                    `);
                }
            });

            // Video konteynır butonu
            editor.ui.registry.addButton('videocontainer', {
                text: '🎥 Video',
                onAction: function() {
                    editor.insertContent(`
                        <div class="video-container">
                            <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
                        </div>
                    `);
                }
            });

            // Özellik kartları butonu
            editor.ui.registry.addButton('featuregrid', {
                text: '✨ Özellikler',
                onAction: function() {
                    editor.insertContent(`
                        <div class="feature-grid">
                            <div class="feature">
                                <h4>Özellik 1</h4>
                                <p>Özellik açıklaması...</p>
                            </div>
                            <div class="feature">
                                <h4>Özellik 2</h4>
                                <p>Özellik açıklaması...</p>
                            </div>
                            <div class="feature">
                                <h4>Özellik 3</h4>
                                <p>Özellik açıklaması...</p>
                            </div>
                        </div>
                    `);
                }
            });

            // Kod bloğu butonu
            editor.ui.registry.addButton('codeblock', {
                text: '💻 Kod',
                onAction: function() {
                    editor.insertContent(`
                        <pre class="code-block">// Kod örneği buraya
const example = "Merhaba Dünya";</pre>
                    `);
                }
            });

            // Not kutusu butonu
            editor.ui.registry.addButton('notebox', {
                text: '📝 Not',
                onAction: function() {
                    editor.insertContent(`
                        <div class="note-box">
                            <p>Önemli not buraya...</p>
                        </div>
                    `);
                }
            });

            // Timeline butonu
            editor.ui.registry.addButton('timeline', {
                text: '📅 Zaman Çizelgesi',
                onAction: function() {
                    editor.insertContent(`
                        <div class="timeline">
                            <div class="timeline-item">
                                <div class="timeline-content">
                                    <h4>Aşama 1</h4>
                                    <p>Açıklama...</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-content">
                                    <h4>Aşama 2</h4>
                                    <p>Açıklama...</p>
                                </div>
                            </div>
                        </div>
                    `);
                }
            });

            // Vurgu kutusu butonu
            editor.ui.registry.addButton('highlight', {
                text: '✨ Vurgu',
                onAction: function() {
                    editor.insertContent(`
                        <div class="highlight-box">
                            <p>Önemli bilgi buraya...</p>
                        </div>
                    `);
                }
            });

            // Kısayol grubu butonu
            editor.ui.registry.addButton('shortcutgroup', {
                text: '⌨️ Kısayol Grubu',
                onAction: function() {
                    editor.insertContent(`
                        <div class="shortcut-group">
                            <kbd>Ctrl</kbd> + <kbd>C</kbd>
                        </div>
                    `);
                }
            });

            // İlerleme göstergesi butonu
            editor.ui.registry.addButton('progress', {
                text: '📊 İlerleme',
                onAction: function() {
                    editor.insertContent(`
                        <div class="progress-steps">
                            <div class="progress-step active">1</div>
                            <div class="progress-step">2</div>
                            <div class="progress-step">3</div>
                        </div>
                    `);
                }
            });

            // 2 Sütunlu Grid
            editor.ui.registry.addButton('layout_2col', {
                text: '⫴ 2 Sütun',
                onAction: function() {
                    editor.insertContent(`
                        <div class="content-grid grid-2-col">
                            <div class="content-draggable">
                                <p>İlk sütun içeriği...</p>
                            </div>
                            <div class="content-draggable">
                                <p>İkinci sütun içeriği...</p>
                            </div>
                        </div>
                    `);
                }
            });

            // 3 Sütunlu Grid
            editor.ui.registry.addButton('layout_3col', {
                text: '⫷ 3 Sütun',
                onAction: function() {
                    editor.insertContent(`
                        <div class="content-grid grid-3-col">
                            <div class="content-draggable">
                                <p>Birinci sütun...</p>
                            </div>
                            <div class="content-draggable">
                                <p>İkinci sütun...</p>
                            </div>
                            <div class="content-draggable">
                                <p>Üçüncü sütun...</p>
                            </div>
                        </div>
                    `);
                }
            });

            // 4 Sütunlu Grid
            editor.ui.registry.addButton('layout_4col', {
                text: '⫸ 4 Sütun',
                onAction: function() {
                    editor.insertContent(`
                        <div class="content-grid grid-4-col">
                            <div class="content-draggable">
                                <p>1. sütun...</p>
                            </div>
                            <div class="content-draggable">
                                <p>2. sütun...</p>
                            </div>
                            <div class="content-draggable">
                                <p>3. sütun...</p>
                            </div>
                            <div class="content-draggable">
                                <p>4. sütun...</p>
                            </div>
                        </div>
                    `);
                }
            });

            // Esnek Konteyner
            editor.ui.registry.addButton('flex_container', {
                text: '↔️ Esnek',
                onAction: function() {
                    editor.insertContent(`
                        <div class="flex-container">
                            <div class="flex-item content-draggable">
                                <p>Esnek öğe 1...</p>
                            </div>
                            <div class="flex-item content-draggable">
                                <p>Esnek öğe 2...</p>
                            </div>
                        </div>
                    `);
                }
            });

            // İçerik sürükle-bırak özelliği
            editor.on('init', function() {
                editor.getBody().addEventListener('dragstart', function(e) {
                    if (e.target.classList.contains('content-draggable')) {
                        e.dataTransfer.setData('text/html', e.target.outerHTML);
                    }
                });

                editor.getBody().addEventListener('dragover', function(e) {
                    e.preventDefault();
                });

                editor.getBody().addEventListener('drop', function(e) {
                    e.preventDefault();
                    if (e.dataTransfer.getData('text/html')) {
                        const dropTarget = e.target.closest('.content-draggable');
                        if (dropTarget) {
                            const draggedHTML = e.dataTransfer.getData('text/html');
                            dropTarget.insertAdjacentHTML('beforebegin', draggedHTML);
                            dropTarget.parentNode.removeChild(dropTarget);
                        }
                    }
                });
            });
        },
        file_picker_callback: function(callback, value, meta) {
            if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.onchange = function() {
                    const file = this.files[0];
                    const formData = new FormData();
                    formData.append('image', file);

                    fetch('/upload-image', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        callback(data.location, { title: file.name });
                    })
                    .catch(error => {
                        console.error('Yükleme hatası:', error);
                    });
                };

                input.click();
            }
        }
    });

    // İçerikleri listele
    function loadContents() {
        fetch('/api/contents')
            .then(res => res.json())
            .then(contents => {
                const contentList = document.querySelector('.content-list');
                contentList.innerHTML = contents.map(content => `
                    <div class="content-item">
                        <div class="content-info">
                            <h3>${content.title}</h3>
                            <div class="content-meta">
                                <span class="category">${getCategoryEmoji(content.category)} ${content.category}</span>
                                <span class="date">Son güncelleme: ${new Date(content.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="content-actions">
                            <button onclick="editContent('${content.id}')" class="edit-btn">
                                <span class="icon">✏️</span> Düzenle
                            </button>
                            <button onclick="deleteContent('${content.id}')" class="delete-btn">
                                <span class="icon">🗑️</span> Sil
                            </button>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('İçerik listeleme hatası:', error);
                alert('İçerikler yüklenirken bir hata oluştu');
            });
    }

    // Kategori emojilerini getir
    function getCategoryEmoji(category) {
        const emojis = {
            'baslangic': '🎯',
            'temel-cizimler': '📝',
            'kopyalama': '🔄',
            'araclar': '🔧',
            'ipuclari': '💡'
        };
        return emojis[category] || '📄';
    }

    // Yeni içerik oluştur
    document.querySelector('.new-content-btn').addEventListener('click', () => {
        editModal.style.display = 'flex';
        contentForm.reset();
        tinymce.get('editor').setContent('');
    });

    // İçerik düzenleme fonksiyonunu güncelle
    window.editContent = async function(id) {
        try {
            const response = await fetch(`/api/contents/${id}`);
            if (!response.ok) throw new Error('İçerik yüklenemedi');

            const content = await response.json();
            console.log('Yüklenen içerik:', content);

            const titleInput = document.querySelector('[name="title"]');
            const categorySelect = document.querySelector('[name="category"]');
            const editor = tinymce.get('editor');

            if (titleInput) titleInput.value = content.title || '';
            if (categorySelect) categorySelect.value = content.category || '';

            // TinyMCE içeriğini güvenli bir şekilde ayarla
            if (editor && content.content) {
                const safeContent = Array.isArray(content.content) 
                    ? content.content.join('') 
                    : String(content.content);

                if (editor.initialized) {
                    console.log('İçerik yükleniyor:', safeContent);
                    editor.setContent(safeContent);
                } else {
                    editor._pendingContent = safeContent;
                }
            }

            // Form ID'sini ayarla
            const contentForm = document.getElementById('contentForm');
            if (contentForm) contentForm.dataset.contentId = id;

            // Modal'ı aç
            const editModal = document.querySelector('.edit-modal');
            if (editModal) editModal.style.display = 'flex';

            // Önizlemeyi güncelle
            setTimeout(updatePreview, 100);

        } catch (error) {
            console.error('İçerik yükleme hatası:', error);
            alert('İçerik yüklenirken bir hata oluştu: ' + error.message);
        }
    };

    window.deleteContent = function(id) {
        if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
            fetch(`/api/contents/${id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    loadContents();
                }
            })
            .catch(error => {
                console.error('Silme hatası:', error);
                alert('İçerik silinirken bir hata oluştu');
            });
        }
    };

    // İçerik kaydet fonksiyonunu güncelle
    contentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Form verilerini JSON olarak hazırla
            const formData = {
                title: document.querySelector('[name="title"]').value,
                category: document.querySelector('[name="category"]').value,
                content: tinymce.get('editor').getContent()
            };

            // Düzenleme mi yoksa yeni içerik mi?
            const contentId = contentForm.dataset.contentId;
            const method = contentId ? 'PUT' : 'POST';
            const url = contentId ? `/api/contents/${contentId}` : '/api/contents';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Kayıt başarısız');
            }

            // Başarılı kayıt
            const editModal = document.querySelector('.edit-modal');
            if (editModal) {
                editModal.style.display = 'none';
            }

            // Form'u temizle
            contentForm.reset();
            tinymce.get('editor').setContent('');
            delete contentForm.dataset.contentId;

            // İçerik listesini güncelle
            loadContents();
            
        } catch (error) {
            console.error('Kayıt hatası:', error);
            alert('Kayıt sırasında bir hata oluştu: ' + error.message);
        }
    });

    // Şablon seçici
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.template-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const template = this.dataset.template;
            let content = '';
            
            switch(template) {
                case 'quickstart':
                    content = `
                        <div class="quick-steps">
                            <h3>🚀 Hızlı Başlangıç</h3>
                            <div class="step-grid">
                                <div class="step">
                                    <div class="step-number">1</div>
                                    <p>İlk adım açıklaması</p>
                                </div>
                                <div class="step">
                                    <div class="step-number">2</div>
                                    <p>İkinci adım açıklaması</p>
                                </div>
                                <div class="step">
                                    <div class="step-number">3</div>
                                    <p>Üçüncü adım açıklaması</p>
                                </div>
                            </div>
                        </div>
                    `;
                    break;
                case 'feature':
                    content = `
                        <div class="feature-grid">
                            <div class="feature">
                                <h4>Özellik 1</h4>
                                <p>Özellik açıklaması...</p>
                            </div>
                            <div class="feature">
                                <h4>Özellik 2</h4>
                                <p>Özellik açıklaması...</p>
                            </div>
                            <div class="feature">
                                <h4>Özellik 3</h4>
                                <p>Özellik açıklaması...</p>
                            </div>
                        </div>
                    `;
                    break;
            }
            
            if (content) {
                tinymce.get('editor').setContent(content);
            }
        });
    });

    // Canlı önizleme
    tinymce.get('editor').on('change keyup', function() {
        updatePreview();
    });

    function updatePreview() {
        const editor = tinymce.get('editor');
        const previewContent = document.querySelector('.preview-content');
        
        if (!editor || !previewContent) return;

        try {
            const content = editor.getContent() || '';
            const title = document.querySelector('[name="title"]')?.value || 'Başlık';
            
            previewContent.innerHTML = `
                <div class="doc-section">
                    <h2>${title}</h2>
                    ${content}
                </div>
            `;
        } catch (error) {
            console.error('Önizleme güncelleme hatası:', error);
        }
    }

    // Önizleme görünümü değiştirme
    document.querySelectorAll('.preview-toggle button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.preview-toggle button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            const previewContent = document.querySelector('.preview-content');
            
            switch(view) {
                case 'tablet':
                    previewContent.style.maxWidth = '768px';
                    break;
                case 'mobile':
                    previewContent.style.maxWidth = '375px';
                    break;
                default:
                    previewContent.style.maxWidth = '100%';
            }
        });
    });

    // Tema değiştirme fonksiyonu
    document.getElementById('themeToggle').addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Sayfa yüklendiğinde tema kontrolü
    document.addEventListener('DOMContentLoaded', function() {
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    });

    // Sayfa yüklendiğinde içerikleri listele
    loadContents();

    // Modal kapatma işlevi
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const editModal = document.querySelector('.edit-modal');
            if (editModal) {
                editModal.style.display = 'none';
            }
        });
    }
}); 