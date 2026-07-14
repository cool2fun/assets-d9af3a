var BLOCKED=['playgama.net','playgama.com','eponesh.com','gameanalytics.com',
'google-analytics.com','googletagmanager.com','yandex.','yastatic.',
'facebook.com','facebook.net','vk.com','doubleclick.net','googleadservices.com',
'cdnjs.cloudflare.com','cdn.jsdelivr.net','unpkg.com'];
self.addEventListener('fetch',function(e){
  var u=e.request.url;
  if(BLOCKED.some(function(d){return u.indexOf(d)!==-1;})){
    e.respondWith(new Response('{}',{status:200,
      headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}}));
  }
});
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
