// تخزين مؤقت: بيخلي التطبيق يفتح من غير نت لو الملف مرفوع على رابط (https).
const C='trips-v2';
const OK=['www.gstatic.com','cdn.jsdelivr.net'];
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin&&!OK.includes(u.hostname))return;   // مش بنلمس اتصال Firebase
  e.respondWith(
    fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match(self.registration.scope)))
  );
});
