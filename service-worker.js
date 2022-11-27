/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["README.md","880132be7b44007108a4aa6b8c1fbf1b"],["data/casual/casual_1.json","19e9d751684b2205f20d8a07bffe9233"],["data/casual/casual_10.json","e5e98c250280e1c297092081ac447810"],["data/casual/casual_11.json","94f44828f9536e52f080c66caa792a15"],["data/casual/casual_12.json","f3e171e7cb8b943039adca4a66d60895"],["data/casual/casual_13.json","b395c7d58430a09f9c583a8c77e7e5c5"],["data/casual/casual_14.json","3df11aae4233d61c49c42b9c6ade17da"],["data/casual/casual_15.json","d78aacf0660f9fc3ea459c8cb1af55fb"],["data/casual/casual_16.json","d7870fe81f4e19da8b065eaa70f7c350"],["data/casual/casual_2.json","fe1347749019e58e15e1c3cb886413c2"],["data/casual/casual_3.json","bb7a3bbe56d5a07e71d52cd8f86fb9b1"],["data/casual/casual_4.json","8415c9137192ec36cb89fb529c892898"],["data/casual/casual_5.json","a89a01c293ecb0051649190db8364f03"],["data/casual/casual_6.json","d7fd4b58afe20131bcffd5555b3bb45d"],["data/casual/casual_7.json","88e1331d8c47011e0453cc48806f7e0c"],["data/casual/casual_8.json","f9be30201610d0161f23f24f3493aacc"],["data/casual/casual_9.json","459c508b8c70e7fd51d6135ced1f1190"],["data/legacy/Board0.json","e755a55bf4a34f14518dd7db1fd8bac7"],["data/legacy/Board1.json","69cd9f42c679a8b967fea9b38f2863ae"],["data/legacy/Board2.json","e214044e07afc40c0b247df8ce0641cd"],["data/legacy/Board3.json","3d005e9c718ef33f4c39b2c992240679"],["data/legacy/Board4.json","8c02e3f2f56dd728b9bd3e5291628a5b"],["data/legacy/Board5.json","7b107f3d3a957f9d7f04e8264bda3b63"],["data/legacy/WordsToFind0.json","99bab7669047a85f000cf3721dfbc315"],["data/legacy/WordsToFind1.json","85175225ff64147efa8242c1031942b5"],["data/legacy/WordsToFind2.json","0d26b8cdec9b22bdf4aadb78c4172ffa"],["data/legacy/WordsToFind3.json","58ca1a9fc5d46cc436e52e375a39ad92"],["data/legacy/WordsToFind4.json","3fc2109bed5a83e04fc24ebbbb5574c1"],["data/legacy/WordsToFind5.json","255a4dade620013258a270842ff62687"],["data/legacy/squardle_0.json","e91597b5da6ff0ee1d06bcff5fbec359"],["data/legacy/squardle_1.json","32817dbdac5bf4c35a098a5de0e482fc"],["data/legacy/squardle_10.json","627caaf5861787c3a15b06c2c3c63292"],["data/legacy/squardle_11.json","5c183a1216bcec6c5d7c52c59c0a20fc"],["data/legacy/squardle_12.json","9502e3a735c5860a0941aa782bc6ba35"],["data/legacy/squardle_13.json","39c5a0d97050823d73aa116dc7d9ee95"],["data/legacy/squardle_14.json","d6421ced5fd779fd02fba8aeea895fef"],["data/legacy/squardle_15.json","151144ffb6e287b327e05262ee2262ee"],["data/legacy/squardle_16.json","048f5efb43e4d1b4ff3c0db59ec2d59a"],["data/legacy/squardle_17.json","1b41b709f326be0a71f6eec88fa2a354"],["data/legacy/squardle_18.json","f61bca0e5661fdf7a27287cea9290621"],["data/legacy/squardle_19.json","55acd167392afaec2b132d7060c63806"],["data/legacy/squardle_2.json","d51782de6625f8599abb7c17f9b5c291"],["data/legacy/squardle_20.json","b5ac3ecba1587ae31a4e3f8455a9b535"],["data/legacy/squardle_21.json","8b4cfac621df70b3782419e4dc51aa1f"],["data/legacy/squardle_22.json","4ed0894600a823dda61274129ff3e63f"],["data/legacy/squardle_3.json","bdc8bc29725682acb66e3b8cff6d4aaf"],["data/legacy/squardle_4.json","48758a758ed674386690b2e30bf34b42"],["data/legacy/squardle_5.json","f779070e3585b0c375bcfdf434fa2986"],["data/legacy/squardle_6.json","c6dab97b5b55818db1f203673a6e8dc2"],["data/legacy/squardle_7.json","f2601376a3a4a895fa857a0b7544dd0b"],["data/legacy/squardle_8.json","96610f6b8567b4579d6d8b268893e60f"],["data/legacy/squardle_9.json","29e7ef77e0c625a5d35210e55eb16486"],["data/special/special_1.json","1c7d3704a2c6529ed8c5c3ec19a8e412"],["data/special/special_2.json","73c6213f8095a37c0a159560edb23dab"],["data/special/special_3.json","d8e5cc15b41066dc0a674f04080618e0"],["data/special/special_4.json","18a83f6001bafa08f829aec69eb7ebdb"],["data/squardlesCasual.json","8f9f1668a34d2cf0be4590c8bf950ae7"],["data/squardlesSpecial.json","b4bda7c443e699cd8c461124d36d8cd2"],["data/squardlesWeekly.json","e374f66e6a6571b4428dcce7c5f4f9d7"],["data/weekly/weekly_1.json","0d655bbe497ca324022f8541a0547c04"],["data/weekly/weekly_10.json","04bc0dd504dca3d7b1c1cf4a86fd3459"],["data/weekly/weekly_11.json","f4a0700d8cdee131e48b3887de01b9af"],["data/weekly/weekly_12.json","e4440ed7bfd8df68719170ec8aade43a"],["data/weekly/weekly_13.json","922408263b11f7066bddf6d31df5c99d"],["data/weekly/weekly_14.json","3afcb1e985e215856659efc5e9d134d9"],["data/weekly/weekly_15.json","e122a8ef9b5dc6f0b970ec1ffff3677f"],["data/weekly/weekly_16_pros_1.json","ed764bb04d6b01ed90fed869e7c73398"],["data/weekly/weekly_17_pros_2.json","de2201b27d2d141e94d69acdeafc0aef"],["data/weekly/weekly_18_pros_3.json","763ff1fcf0af1ee6b29cdadb8733fef9"],["data/weekly/weekly_19_pros_4.json","4b57b45bb6b43fa360f723dd6505a356"],["data/weekly/weekly_2.json","040be8b3ef79fa39c6da47f1f224a953"],["data/weekly/weekly_20.json","cdf368d16a48f9e153453e245c9731f8"],["data/weekly/weekly_3.json","810964c00ec8a59f2a012dbd486f20f8"],["data/weekly/weekly_4.json","00c13aa7f4735fa627c89d3782e07fff"],["data/weekly/weekly_5.json","6b578228eb88f3ccf7f1ca994c7504b4"],["data/weekly/weekly_6.json","bd64354a888f7671e6dc5f9f7dfd89e4"],["data/weekly/weekly_7.json","688bc1870fa9aeb21d2758f7dc85d085"],["data/weekly/weekly_8.json","724866c8f739bc731049d7ddc408e28b"],["data/weekly/weekly_9.json","d0abb4ea8e24a7f1afa0d5ec69ae71c1"],["images/background.png","1a5f799bc2226c3d39b0c319d2ac1619"],["images/blue_sphere_brain.png","42204b51e67cce335a2dd33513be31c7"],["images/cogs.svg","2b4000329c10d964c0b93365875fb1bf"],["images/delete.svg","270d72e93d421c23d4c519692a187af4"],["images/external_link.svg","dd73ef33ece0463279000ed5c05ee8a7"],["images/eye.svg","6dd07da111061a81e23f44c63eb163f0"],["images/folder.svg","7f6da859f58fead4b62fc9d6fb2f121c"],["images/funny_glasses.svg","2f5ddb0a37ad4e2c2a89bce69f5b52b1"],["images/glasses.svg","0ef1f8e5442260076617c2eeafee6579"],["images/haluz.jpg","0d64d236837f995f647d59652786e2cd"],["images/hashtag.svg","edf026fca31d7a641db281a55479e71e"],["images/hemp.png","9bcbbbffc38b68e9b9599dc9bdcfd5c7"],["images/hourglass.jpg","31597d060d9d2dd3a53cf705b03c9f96"],["images/hourglass.png","31597d060d9d2dd3a53cf705b03c9f96"],["images/hourglass.svg","445bd9043efd52bb3a0a529c3b2e312b"],["images/line.svg","706383dcc54392c112245cabf420ecda"],["images/line_white.svg","b47e485c7da10f7bf32b2d15fc34a792"],["images/list.svg","dfe641052f06e29456d426b4f33d9eed"],["images/lock.png","c0b695d1f154cb00fd2f2ee454beec9d"],["images/lock.svg","33b2d80efac866a6892599c3a7e6dbe5"],["images/magnifying_glass.svg","1c0fd579c846af4a50f0346cc12673da"],["images/maze.jpg","f3280755194c505a0a4cd7ed67db7a46"],["images/maze.png","c8822125a1b3c5f4666bb832f81a5adc"],["images/menu.svg","2eb00ba5e0676eed806ba9c2564418c2"],["images/mondrian.jpg","0308a459ca20279afd646cbe5c3777e9"],["images/notniceexample.png","6ed21cf09d0252704be9e6dc5a61bbed"],["images/plus.svg","120ac679334ef53a9d91711ec1ac1d3b"],["images/race_flag.svg","ca4eeaf5d163f46044887356bc70f698"],["images/relax.jpg","0e89d2b5ffed12826251daba2c21b304"],["images/screenLayout.JPG","4298ab6ac4ab5ed545e3528dc2a227ad"],["images/screenLayoutWithNotes.jpg","5cd10e7a5a8753648508eae99a03068f"],["images/share.svg","f5534b950bc66c0d71019825cf31fd0f"],["images/star.svg","28cb2290200e559ec71829ef66324af0"],["images/swirl.png","b336b791c3dc03882a1f7933d4a5342d"],["images/swirl_2.png","dddc68e55150bce36e039fc64139c9bd"],["images/swirl_3.png","dc5588f70bc4e9f40e0a1247ca1ead18"],["images/swirl_4.png","eb56b17c65b4c7721be40545752c8dac"],["images/swirl_5.png","87cfa2a02a8a7dd36673c5c7394b0501"],["images/swirl_6.png","eaa94555cde6f571cc1428537a47e899"],["images/techno.jpg","41341675944e1036cc505820e9bf7775"],["images/tick.svg","461bda8f2f76390bbb7b77024bbbd69c"],["images/void.png","b7338e3cfbcd0c270c21f6762c160166"],["images/warden.jpg","c97a21f9585029b639699783ebe7ba7e"],["images/wordSelection.png","f1ec4463d6bf1fb5d6072794acf81c21"],["index.css","a5bb8dfa1b98a201b0ba9feed97c1294"],["index.html","0c976e330ed009ec7e5974d9ebc7a8b6"],["libraries/czech.json","dc25464f3d6fae44c4db451b43469602"],["libraries/czechWhatsAppWordsRaw.txt","247676c40fa6571cd07466c506846c85"],["libraries/english.json","27f3f93f25ab8f769e94839ffa425793"],["libraries/libraryConnected.json","62680b7f0ce3b4863a849ef5c97e17ab"],["libraries/library_syn2015.json","d2205e935ae93a70b6f5797ab4ed26d3"],["libraries/slova.txt","19cbe518967b42c2bf40d499a0e5a3d7"],["manifest.json","65159cd11e397ec132fed8829b8a8d67"],["old_things/czech.json","993e5af403cd87adc91358740076918d"],["old_things/generator.js","46d636e39c58ba203f626df24cf4da81"],["old_things/library.txt","e536af385d0b64e66a1dce6abd8c4c94"],["old_things/library1.json","fd2d69aea5692f512cc7520d90f8fe90"],["old_things/nodeGenerator.js","d41d8cd98f00b204e9800998ecf8427e"],["old_things/squardleGenerator.js","28e8d0fa361831811f120c804a5543a7"],["old_things/syn2015.tsv","1bd64b5c4e4f8de87143e4f8df28a11f"],["scripts/browser.js","d1289a5ed2eca63242bb5facbe5041cf"],["scripts/buttons.js","d41d8cd98f00b204e9800998ecf8427e"],["scripts/functions.js","1543acd8b741d2b4a702eeb10df761af"],["scripts/game/board.js","2336417e95e3d94e76e76da129ed5a08"],["scripts/game/foundWords.js","3e512f9b0b12c2607689c8ecc864d5e8"],["scripts/game/hints.js","bf0ae0140200621b2db999959fefac8a"],["scripts/game/line.js","10be4a7dcbc5750d2a169ee6d68c9048"],["scripts/game/mouseEvents.js","f5d19e9b7ca0e4830bc261dd9b9f0cd0"],["scripts/game/output.js","f199c0933c0d006bfb16f9f66e8ff415"],["scripts/game/progress.js","4465f0c29ca7e7a8d19b7eca77567730"],["scripts/game/score.js","44b589bdfa3d10f673fd5f45734358a7"],["scripts/game/squardle.js","06b5334a28c7d876b66b28b65df98f0b"],["scripts/game/win.js","fc3ab054bdde590a94710f7f968dbaf7"],["scripts/global.js","3338cc21eb94cecc906632ebe2afdb31"],["scripts/menu.js","77f9a0eeed2ea7240dc65dbd3272ed7b"],["scripts/pageSwitches.js","7c1a3574c69f7772a9da8472b748c294"],["scripts/particles.js","b61aa7cfd887a5b3afa8f5c874ec1ac7"],["scripts/settings.js","7de752e31cfaecf717accfff72282595"],["scripts/share.js","ecb88efbd63056408cb2552033245b8b"],["scripts/siteController.js","a58c8b97b77ecb75117775c6a3ee437f"],["scripts/stats.js","461e4d5675a819040c137d99cfa73f78"],["scripts/updateHandler.js","8ceb95fda12f8cb1e0274dcc14f3f59e"],["style/about.css","a39834b78273ae164416310cce3a7333"],["style/browser.css","a094bb77c2ba52e09a240664a2183786"],["style/game.css","f240d6cafd98f4b9f694f92ea3d28551"],["style/global.css","67dfeff4aac25cd6350af40418f86b5e"],["style/guide.css","075f0a3fd33c4aaa8a4af617a72f7bea"],["style/main.css","208e6bb97303333697c274a70ea440aa"],["style/news.css","cee98e24f97e9e9186cc8ba0600c92b7"],["style/settings.css","a31a356b1d047adef3f7b31d574bbc8b"],["style/stats.css","24dbd89f05bd704ca0208b929fba9fd8"],["sw-precache-config.json","e041e7ea4687417a992d548119a5d8d4"],["tools/createWordLibrary.js","2f307d2857d48f48a971846681fb9eee"],["tools/editorExporter.js","0022c450df47685e203ccd59faaff66d"],["tools/menu.js","bdb46ca4ebf91d86b844857c73b51890"],["tools/pageFunctions.js","2e8626ce293c937ab6a8fe5791a83e40"],["tools/pageSquardleEditor.css","f64cef5059fce09a4e189b22f0d4632e"],["tools/pageSquardleEditor.html","9085207205e403268a68d5fcd62c92aa"],["tools/pageSquardleEditor.js","0670762cc89c151fc763eed5e32001ea"],["tools/pageSquardleGenerator.js","97d26a0e1f18307000eed785593e7178"],["tools/randomBackground.js","8265ea36da3818235bedbc98762d95f0"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







