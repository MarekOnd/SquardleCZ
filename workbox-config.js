// module.exports = function generateSW({
//   // dontCacheBustURLsMatching: [new RegExp('...')],
//   // globDirectory: '...',
//   // globPatterns: ['...', '...'],
//   maximumFileSizeToCacheInBytes:3145728,
//   // navigateFallback: '...',
//   // runtimeCaching: [{
//   //   // Routing via a matchCallback function:
//   //   urlPattern: ({request, url}) => ...,
//   //   handler: '...',
//   //   options: {
//   //     cacheName: '...',
//   //     expiration: {
//   //       maxEntries: ...,
//   //     },
//   //   },
//   // }, {
//   //   // Routing via a RegExp:
//   //   urlPattern: new RegExp('...'),
//   //   handler: '...',
//   //   options: {
//   //     cacheName: '...',
//   //     plugins: [..., ...],
//   //   },
//   // }],
//   // skipWaiting: ...,
//   swDest: 'service-worker.js'
// })


module.exports = {
  maximumFileSizeToCacheInBytes:3145728,
  globDirectory: './',
  swDest: 'service-worker.js'
}