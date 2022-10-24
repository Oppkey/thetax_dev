'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/assets/images/people/image_2.jpg": "721ba15e0e896587d1300d3ab5aa5fd3",
"assets/assets/images/people/image_1.png": "c6936365978d311aa94129ef3ccabbcd",
"assets/assets/images/people/image_5.jpg": "94301216c6cc0ba6c1c4aea9e95e7c2d",
"assets/assets/images/people/image_2.png": "3032472bade42c64d7171823caef44fa",
"assets/assets/images/people/image_4.png": "1416ea9c1fbffcf93fef70505face5f7",
"assets/assets/images/people/image_1.jpg": "29e64d6523071cd8ae5f3f3f24d7153b",
"assets/assets/images/people/image_3.png": "a5679e2c45d8fe0be9483b1ead91bf95",
"assets/assets/images/people/image_3.jpg": "2fdfee8a8d38ff055f812b518b12dc6a",
"assets/assets/images/people/image_5.png": "38933bf1d7b8d5e7e10bb79c0534ce47",
"assets/assets/images/people/image_4.jpg": "8cd7149369c320446dafb2408ce7326c",
"assets/assets/images/teasers/bitrate.webp": "a32427824efdaf86f9a4de32efb6e256",
"assets/assets/images/teasers/frame-extraction.webp": "184ca70f1ed7c4d4b854d0e434c76ac6",
"assets/assets/images/teasers/livestreamWiFi.webp": "e988fba0d68387b60c81af7aa388579f",
"assets/assets/images/teasers/5dot7k.webp": "073ea8743b44af95a19c99c485006169",
"assets/assets/images/teasers/plugin.webp": "5bad1df875c6877a65980145f46a9f65",
"assets/assets/images/teasers/vslam2.webp": "04ce793e79f1e4c4729d0fc1d29cc5a1",
"assets/assets/images/teasers/lcd.webp": "78e1ce06d00877cdcd89116330bd7eed",
"assets/assets/images/teasers/gps.webp": "a4b9127253dc7a76fd624ec9fb78c8a2",
"assets/assets/images/teasers/image-size.webp": "da856349b1ad9232c74805c593c24716",
"assets/assets/images/teasers/livestreamingUSB.webp": "41084dd915a328e642b69d4d30864f7f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/AssetManifest.json": "d187be7402847820e1beb5c92868f506",
"assets/shaders/ink_sparkle.frag": "75fef19596efa11fd564bc3ec1e1bbc0",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/NOTICES": "fece7e31c8975bb24a6bcc96b0d2a354",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"loading.webp": "825752fbfbf1f168c28b192392ce01d7",
"main.dart.js": "638458e1d91867c24b9de3839bd86a23",
"version.json": "87cf0f6d6e5bbc54bea8d7e5f3907279",
"index.html": "6f17e07bc7e3cf815f2ba15dd08dd643",
"/": "6f17e07bc7e3cf815f2ba15dd08dd643",
"manifest.json": "e2f80313b4e1a1cd5f62aee4ecf2c67c",
"favicon.png": "375c9521d19d6dfe04bf664132774074",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"theta_x.webp": "06d052343b97eeba286b467b78db9596"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
