require('dotenv').config();
const ngrok = require('ngrok');

(async function() {
  try {
    const port = process.env.PORT || 3001;
    const url = await ngrok.connect(port);
    console.log(`✅ NGROK URL (${port}):`, url);
    // keep process alive
    setInterval(() => {}, 1000 * 60 * 60);
  } catch (err) {
    console.error('❌ Error while connecting ngrok:', err);
  }
})();
