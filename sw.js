const CACHE_NAME = 'pao-do-ciso-v1';
// Removidas as barras iniciais para funcionar em qualquer subdiretório
const assets = [
  './',
  './index.html',
  './css/layout-base.css',
  './js/carrinho.js',
  './img/logo192x192.png'
];

// Instalação: Salva arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos em cache!');
      return cache.addAll(assets);
    })
  );
});

// Estratégia: Tenta rede, se falhar, usa o cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});