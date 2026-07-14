const CACHE_NAME = 'hcim-progression-v4.4.5-discord-browser-1';
const APP_SHELL = [
  './','./index.html','./style.css','./script.js','./app-ui.js','./discord-browser-settings.js','./companion-link.js','./group-live-map.js','./beta-ui.js','./auth.js','./app-version.js','./firebase-config.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png',
  './assets/diaries/ardougne.svg','./assets/diaries/desert.svg','./assets/diaries/falador.svg','./assets/diaries/fremennik.svg','./assets/diaries/kandarin.svg','./assets/diaries/karamja.svg','./assets/diaries/lumbridge-draynor.svg','./assets/diaries/morytania.svg','./assets/diaries/varrock.svg','./assets/diaries/western-provinces.svg','./assets/diaries/wilderness.svg','./assets/diaries/kourend-kebos.svg'
];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  if(req.mode==='navigate') {
    event.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put('./index.html',c)).catch(()=>{});return r;}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
    if(response && response.ok && (new URL(req.url).origin===self.location.origin)) { const copy=response.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{}); }
    return response;
  })));
});
