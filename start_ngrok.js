const ngrok = require('ngrok');

(async function() {
  try {
    const url = await ngrok.connect(3000);
    console.log('✅ NGROK URL:', url);
    // keep process alive
    setInterval(() => {}, 1000 * 60 * 60);
  } catch (err) {
    console.error('❌ Error while connecting ngrok:', err);
  }
})();
