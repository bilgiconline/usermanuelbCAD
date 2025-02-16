const browserSync = require('browser-sync').create();

browserSync.init({
    proxy: 'localhost:3000',
    files: [
        '*.html',
        'docs/*.html',
        '*.css',
        '*.js'
    ],
    ignore: ['node_modules'],
    reloadDelay: 500,
    notify: {
        styles: {
            top: 'auto',
            bottom: '0',
            padding: '5px',
            borderRadius: '5px 0 0',
            backgroundColor: '#333',
            color: 'white'
        }
    }
}); 