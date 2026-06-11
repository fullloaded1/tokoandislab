import https from 'https';

https.get('https://andislabs.com/lovibond/kabinet-termostatik-bod', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<p class="text-slate-600 text-sm leading-relaxed mb-6">([\s\S]*?)<\/p>/);
    console.log(match ? match[1] : 'Not found');
  });
});
