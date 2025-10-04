// nome e versão do cache
const CACHE_NAME = 'identiplanta-cache-v05';

// arquivos essenciais offline
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/styles/style.css',
  '/scripts/main.js',
  '/assets/images/icon-192x192.png',
  '/assets/images/icon-512x512.png'
];

// --- O EVENTO 'INSTALL': Guarda os arquivos em cache --- //
// 'self' se refere ao próprio service worker
self.addEventListener('install', event => {
  // O navegador espera até que a promessa dentro de waitUntil seja resolvida
  event.waitUntil(
    // Abre o cache com o nome que definimos
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto. Adicionando arquivos ao cache...');
        // Adiciona todos os nossos arquivos da lista ao cache
        return cache.addAll(urlsToCache);
      })
  );
});

// --- O EVENTO 'FETCH': Intercepta as requisições --- //
self.addEventListener('fetch', event => {
  // Responde à requisição com uma estratégia de "Cache First"
  event.respondWith(
    // Procura no cache por uma requisição que corresponda à atual
    caches.match(event.request)
      .then(response => {
        // Se encontrarmos uma resposta no cache...
        if (response) {
          // ...a retornamos diretamente, sem ir para a internet.
          return response;
        }
        // Se não encontrarmos no cache, deixamos a requisição continuar para a internet.
        return fetch(event.request);
      })
  );
});