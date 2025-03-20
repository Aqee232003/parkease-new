// Service Worker for ParkEase
const CACHE_NAME = "parkease-v1"
const OFFLINE_URL = "/offline"
const MAP_CACHE_NAME = "parkease-maps-v1"

// Resources to pre-cache
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/login",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/data/parking-spots.json",
  "/data/cities.json",
]

// OpenStreetMap tile URLs to match and cache
const OSM_TILE_REGEX = /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/

// Install event - precache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== MAP_CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && !OSM_TILE_REGEX.test(event.request.url)) {
    return
  }

  // Handle OpenStreetMap tile requests
  if (OSM_TILE_REGEX.test(event.request.url)) {
    event.respondWith(
      caches.open(MAP_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                const responseToCache = response.clone()
                cache.put(event.request, responseToCache)
              }
              return response
            })
            .catch(() => {
              // If fetch fails (offline), return a fallback tile
              return caches.match("/maps/fallback-tile.png")
            })
        })
      }),
    )
    return
  }

  // Handle map data requests
  if (event.request.url.includes("/data/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(event.request).then((response) => {
          // Cache map data aggressively
          if (response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
      }),
    )
    return
  }

  // For HTML requests - network first, fallback to cache, then offline page
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          return caches.match(OFFLINE_URL)
        })
      }),
    )
    return
  }

  // For other requests - cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
    }),
  )
})

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bookings") {
    event.waitUntil(syncBookings())
  } else if (event.tag === "sync-payments") {
    event.waitUntil(syncPayments())
  } else if (event.tag === "sync-map-tiles") {
    event.waitUntil(syncMapTiles())
  }
})

// Push notification handler
self.addEventListener("push", (event) => {
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})

// Function to sync bookings when online
async function syncBookings() {
  // Get all bookings from IndexedDB
  const bookings = JSON.parse(localStorage.getItem("parkease-bookings") || "[]")

  // Filter unsynchronized bookings
  const unsyncedBookings = bookings.filter((booking) => !booking.synced)

  // Sync each booking
  for (const booking of unsyncedBookings) {
    try {
      // In a real app, this would call your API
      console.log("Syncing booking:", booking.id)

      // Mark as synced
      booking.synced = true
    } catch (error) {
      console.error("Error syncing booking:", error)
    }
  }

  // Save updated bookings
  localStorage.setItem("parkease-bookings", JSON.stringify(bookings))
}

// Function to sync payments when online
async function syncPayments() {
  // Similar implementation to syncBookings
  console.log("Syncing payments with server")
}

// Function to sync map tiles when online
async function syncMapTiles() {
  // This would be implemented to pre-cache additional map tiles
  console.log("Syncing map tiles")
}

