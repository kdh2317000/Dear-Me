const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html') && f !== 'index.html');

const metaTags = `    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#5c67f2">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/icon.svg">
    <link rel="icon" type="image/svg+xml" href="/icon.svg">`;

const mobileNavScript = `    <script src="/mobile-nav.js" defer></script>`;

for (const file of files) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace or insert viewport
    if (content.includes('<meta name="viewport"')) {
        content = content.replace(/<meta name="viewport"[^>]*>/, metaTags);
    } else {
        content = content.replace('<head>', '<head>\n' + metaTags);
    }

    // 2. Insert mobile-nav.js before </head> if not exists
    if (!content.includes('/mobile-nav.js')) {
        content = content.replace('</head>', mobileNavScript + '\n</head>');
    }

    // 3. Ensure style.css is linked in login/register if missing
    if (['login.html', 'register.html'].includes(file) && !content.includes('style.css')) {
        content = content.replace('</head>', '    <link rel="stylesheet" href="/style.css">\n</head>');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
}
