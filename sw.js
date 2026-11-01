// Service worker: app instalable y uso sin señal con lo último consultado.
const SHELL = 'aves-shell-v4';
const API_CACHE = 'aves-api-v1';
const IMG_CACHE = 'aves-img-v1';
const FONT_CACHE = 'aves-font-v1';
const SHELL_FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const MAX_IMAGES = 300;
const MAX_API = 200;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  const keep = [SHELL, API_CACHE, IMG_CACHE, FONT_CACHE];
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => !keep.includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max){
  const c = await caches.open(cacheName);
  const keys = await c.keys();
  for(let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

async function networkFirst(req, cacheName, max){
  const c = await caches.open(cacheName);
  try{
    const res = await fetch(req);
    if(res.ok){ c.put(req, res.clone()); if(max) trim(cacheName, max); }
    return res;
  }catch(err){
    const hit = await c.match(req, {ignoreSearch: cacheName === SHELL});
    if(hit) return hit;
    throw err;
  }
}

async function cacheFirst(req, cacheName, max){
  const c = await caches.open(cacheName);
  const hit = await c.match(req);
  if(hit) return hit;
  const res = await fetch(req);
  if(res.ok || res.type === 'opaque'){ c.put(req, res.clone()); if(max) trim(cacheName, max); }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  if(url.hostname === 'api.inaturalist.org'){
    e.respondWith(networkFirst(req, API_CACHE, MAX_API));
  } else if(req.destination === 'image' && /inaturalist-open-data\.s3\.amazonaws\.com|static\.inaturalist\.org/.test(url.hostname)){
    e.respondWith(cacheFirst(req, IMG_CACHE, MAX_IMAGES));
  } else if(/fonts\.(googleapis|gstatic)\.com/.test(url.hostname)){
    e.respondWith(cacheFirst(req, FONT_CACHE, 30));
  } else if(url.origin === self.location.origin){
    e.respondWith(networkFirst(req, SHELL));
  }
});
