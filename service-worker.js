const CACHE_NAME = 'hcim-progression-v0.4.6-diary-artwork-upgrade';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './app-ui.js',
  './beta-ui.js',
  './auth.js',
  './firebase-config.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/diaries/ardougne.svg',
  './assets/diaries/desert.svg',
  './assets/diaries/falador.svg',
  './assets/diaries/fremennik.svg',
  './assets/diaries/kandarin.svg',
  './assets/diaries/karamja.svg',
  './assets/diaries/lumbridge-draynor.svg',
  './assets/diaries/morytania.svg',
  './assets/diaries/varrock.svg',
  './assets/diaries/western-provinces.svg',
  './assets/diaries/wilderness.svg',
  './assets/diaries/kourend-kebos.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});
