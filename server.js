const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

// Enlace RAW a tu archivo link.txt de GitHub
const LINK_TXT_URL = 'https://raw.githubusercontent.com/GeorgeBravo2404/iptv-proxy/main/link.txt';

app.get('/', async (req, res) => {
  try {
    const response = await fetch(LINK_TXT_URL);
    if (!response.ok) throw new Error('No se pudo obtener el link');

    const m3u8Link = (await response.text()).trim();

    console.log('🔁 Redirigiendo a:', m3u8Link);
    res.redirect(m3u8Link);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).send('Error obteniendo enlace');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
