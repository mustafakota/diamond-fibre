import http from 'http';

http.get('http://localhost:3000/en', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Has MobileNav button:', data.includes('Open navigation menu'));
    console.log('Has mobile-navigation-drawer:', data.includes('mobile-navigation-drawer'));
    console.log('Has logo:', data.includes('diamond-fibre-logo.webp'));
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
