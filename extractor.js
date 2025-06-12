const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const m3u8Urls = [];

  // Escuchar todas las peticiones de red
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.m3u8')) {
      console.log('🔗 Capturado:', url);
      m3u8Urls.push(url);
    }
  });

  console.log('🌐 Abriendo página...');
  await page.goto('https://stream196tp.com/global2.php?stream=espn', {
    waitUntil: 'load', // Puede cambiarse a 'networkidle' si es lento
    timeout: 15000
  });

  // Esperar un poco más por si tarda el script de video
  await page.waitForTimeout(8000);

  await browser.close();

  if (m3u8Urls.length > 0) {
    // Escoge el que contiene "index.m3u8"
    const finalUrl = m3u8Urls.find(url => url.includes('index.m3u8')) || m3u8Urls[0];

    console.log('\n✅ Enlace final:\n', finalUrl);
    fs.writeFileSync('link.txt', finalUrl);
  } else {
    console.log('\n❌ No se encontró ningún enlace .m3u8\n');
  }
})();
