/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "372cd72273f88d5fc0117857e43795c3"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ecf831ca88bbf78948c78d0e2b5abb47"
  }, {
    "url": "pwa-192x192.png",
    "revision": "b32ac3b1ab986090b59fd260ab3bdd7d"
  }, {
    "url": "phimatics-logo.svg",
    "revision": "439a20c1521381cd5a8f6c475d9234de"
  }, {
    "url": "phimatics-download-hub.html",
    "revision": "32bab67824dc53a9b4ecab7690f02c44"
  }, {
    "url": "phimatics-classes-offline-app.html",
    "revision": "33447a1af919b1827b78ba5bd7c2a1f1"
  }, {
    "url": "index.html",
    "revision": "11bf4db643e7e61ee6cc642e2224b35b"
  }, {
    "url": "icon-512.png",
    "revision": "ecf831ca88bbf78948c78d0e2b5abb47"
  }, {
    "url": "icon-192.png",
    "revision": "b32ac3b1ab986090b59fd260ab3bdd7d"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "64792b019b160427c1b7341715ab0f04"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/index-COWJ3NMO.js",
    "revision": null
  }, {
    "url": "assets/index-B3iWce0y.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "64792b019b160427c1b7341715ab0f04"
  }, {
    "url": "icon-192.png",
    "revision": "b32ac3b1ab986090b59fd260ab3bdd7d"
  }, {
    "url": "icon-512.png",
    "revision": "ecf831ca88bbf78948c78d0e2b5abb47"
  }, {
    "url": "manifest.json",
    "revision": "47d62011a13222b8e0fd52673d01a576"
  }, {
    "url": "phimatics-logo.svg",
    "revision": "439a20c1521381cd5a8f6c475d9234de"
  }, {
    "url": "pwa-192x192.png",
    "revision": "b32ac3b1ab986090b59fd260ab3bdd7d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "ecf831ca88bbf78948c78d0e2b5abb47"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "372cd72273f88d5fc0117857e43795c3"
  }, {
    "url": "manifest.json",
    "revision": "666bf927ab0011fde20eb94227fff9c8"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
