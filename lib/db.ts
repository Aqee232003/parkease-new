// IndexedDB setup and operations
const DB_NAME = "parkease-db"
const DB_VERSION = 2

// Database schema
const STORES = {
  USER: "user",
  PARKING_SPOTS: "parkingSpots",
  BOOKINGS: "bookings",
  PAYMENTS: "payments",
  MAPS: "maps",
  CITIES: "cities",
  SEARCH_INDEX: "searchIndex",
}

export function initDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject("IndexedDB not supported")
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      reject("IndexedDB error: " + request.error)
    }

    request.onsuccess = (event) => {
      const db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = request.result

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.USER)) {
        db.createObjectStore(STORES.USER, { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains(STORES.PARKING_SPOTS)) {
        const parkingStore = db.createObjectStore(STORES.PARKING_SPOTS, { keyPath: "id" })
        parkingStore.createIndex("byLocation", "location", { unique: false })
        parkingStore.createIndex("byAvailability", "isAvailable", { unique: false })
        parkingStore.createIndex("byLatLng", ["lat", "lng"], { unique: false })
        parkingStore.createIndex("byPrice", "price", { unique: false })
        parkingStore.createIndex("byType", "type", { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.BOOKINGS)) {
        const bookingStore = db.createObjectStore(STORES.BOOKINGS, { keyPath: "id", autoIncrement: true })
        bookingStore.createIndex("byUser", "userId", { unique: false })
        bookingStore.createIndex("byStatus", "status", { unique: false })
        bookingStore.createIndex("byDate", "date", { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
        const paymentStore = db.createObjectStore(STORES.PAYMENTS, { keyPath: "id", autoIncrement: true })
        paymentStore.createIndex("byBooking", "bookingId", { unique: false })
        paymentStore.createIndex("byStatus", "status", { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.MAPS)) {
        db.createObjectStore(STORES.MAPS, { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains(STORES.CITIES)) {
        const citiesStore = db.createObjectStore(STORES.CITIES, { keyPath: "id" })
        citiesStore.createIndex("byName", "name", { unique: false })
        citiesStore.createIndex("byState", "state", { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.SEARCH_INDEX)) {
        const searchStore = db.createObjectStore(STORES.SEARCH_INDEX, { keyPath: "id", autoIncrement: true })
        searchStore.createIndex("byTerm", "term", { unique: false })
        searchStore.createIndex("byType", "type", { unique: false })
      }
    }
  })
}

// User operations
export async function saveUser(user: any) {
  const db = await openDB()
  const tx = db.transaction(STORES.USER, "readwrite")
  const store = tx.objectStore(STORES.USER)
  await store.put(user)
  return tx.complete
}

export async function getUser(id: string) {
  const db = await openDB()
  const tx = db.transaction(STORES.USER, "readonly")
  const store = tx.objectStore(STORES.USER)
  return store.get(id)
}

// Parking spots operations
export async function saveParkingSpots(spots: any[]) {
  const db = await openDB()
  const tx = db.transaction(STORES.PARKING_SPOTS, "readwrite")
  const store = tx.objectStore(STORES.PARKING_SPOTS)

  for (const spot of spots) {
    await store.put(spot)
  }

  // Also update search index
  await updateSearchIndex(spots)

  return tx.complete
}

export async function getParkingSpots() {
  const db = await openDB()
  const tx = db.transaction(STORES.PARKING_SPOTS, "readonly")
  const store = tx.objectStore(STORES.PARKING_SPOTS)
  return store.getAll()
}

export async function getParkingSpot(id: string) {
  const db = await openDB()
  const tx = db.transaction(STORES.PARKING_SPOTS, "readonly")
  const store = tx.objectStore(STORES.PARKING_SPOTS)
  return store.get(id)
}

export async function getNearbyParkingSpots(lat: number, lng: number, radius: number) {
  const allSpots = await getParkingSpots()

  // Filter spots by distance (simple calculation)
  return allSpots.filter((spot: any) => {
    const distance = calculateDistance(lat, lng, spot.lat, spot.lng)
    return distance <= radius
  })
}

export async function searchParkingSpots(query: string) {
  if (!query || query.trim() === "") {
    return []
  }

  const lowerQuery = query.toLowerCase().trim()
  const allSpots = await getParkingSpots()

  return allSpots.filter((spot: any) => {
    return (
      spot.name.toLowerCase().includes(lowerQuery) ||
      spot.address.toLowerCase().includes(lowerQuery) ||
      spot.description.toLowerCase().includes(lowerQuery)
    )
  })
}

export async function filterParkingSpots(filters: any) {
  const allSpots = await getParkingSpots()

  return allSpots.filter((spot: any) => {
    let match = true

    if (filters.minPrice !== undefined && spot.price < filters.minPrice) {
      match = false
    }

    if (filters.maxPrice !== undefined && spot.price > filters.maxPrice) {
      match = false
    }

    if (filters.type && filters.type !== "all" && spot.type !== filters.type) {
      match = false
    }

    if (filters.covered !== undefined && spot.covered !== filters.covered) {
      match = false
    }

    if (filters.ev !== undefined && spot.ev !== filters.ev) {
      match = false
    }

    if (filters.minAvailable !== undefined && spot.availableSpots < filters.minAvailable) {
      match = false
    }

    return match
  })
}

// Cities operations
export async function saveCities(cities: any[]) {
  const db = await openDB()
  const tx = db.transaction(STORES.CITIES, "readwrite")
  const store = tx.objectStore(STORES.CITIES)

  for (const city of cities) {
    await store.put(city)
  }

  return tx.complete
}

export async function getCities() {
  const db = await openDB()
  const tx = db.transaction(STORES.CITIES, "readonly")
  const store = tx.objectStore(STORES.CITIES)
  return store.getAll()
}

export async function getCity(id: string) {
  const db = await openDB()
  const tx = db.transaction(STORES.CITIES, "readonly")
  const store = tx.objectStore(STORES.CITIES)
  return store.get(id)
}

// Search index operations
async function updateSearchIndex(spots: any[]) {
  const db = await openDB()
  const tx = db.transaction(STORES.SEARCH_INDEX, "readwrite")
  const store = tx.objectStore(STORES.SEARCH_INDEX)

  // Clear existing index
  await store.clear()

  // Create search terms from parking spots
  for (const spot of spots) {
    // Index name
    const nameTerms = spot.name.toLowerCase().split(" ")
    for (const term of nameTerms) {
      if (term.length > 2) {
        await store.add({
          term,
          type: "name",
          spotId: spot.id,
        })
      }
    }

    // Index address
    const addressTerms = spot.address.toLowerCase().split(/[\s,]+/)
    for (const term of addressTerms) {
      if (term.length > 2) {
        await store.add({
          term,
          type: "address",
          spotId: spot.id,
        })
      }
    }
  }

  return tx.complete
}

export async function searchByTerm(term: string) {
  if (!term || term.length < 3) {
    return []
  }

  const lowerTerm = term.toLowerCase().trim()
  const db = await openDB()
  const tx = db.transaction(STORES.SEARCH_INDEX, "readonly")
  const store = tx.objectStore(STORES.SEARCH_INDEX)
  const index = store.index("byTerm")

  // Get all entries that start with the term
  const range = IDBKeyRange.bound(lowerTerm, lowerTerm + "\uffff")
  const results = await index.getAll(range)

  // Get unique spot IDs
  const spotIds = [...new Set(results.map((result) => result.spotId))]

  // Get the actual spots
  const spots = []
  for (const id of spotIds) {
    const spot = await getParkingSpot(id)
    if (spot) {
      spots.push(spot)
    }
  }

  return spots
}

// Booking operations
export async function createBooking(booking: any) {
  const db = await openDB()
  const tx = db.transaction([STORES.BOOKINGS, STORES.PARKING_SPOTS], "readwrite")

  // Add booking
  const bookingStore = tx.objectStore(STORES.BOOKINGS)
  const bookingId = await bookingStore.add(booking)

  // Update parking spot availability
  const spotStore = tx.objectStore(STORES.PARKING_SPOTS)
  const spot = await spotStore.get(booking.spotId)
  spot.availableSpots = Math.max(0, spot.availableSpots - 1)
  await spotStore.put(spot)

  // Schedule sync when online
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready
    await registration.sync.register("sync-bookings")
  }

  await tx.complete
  return bookingId
}

export async function getUserBookings(userId: string) {
  try {
    const db = await openDB()
    const tx = db.transaction(STORES.BOOKINGS, "readonly")
    const store = tx.objectStore(STORES.BOOKINGS)
    const index = store.index("byUser")
    const bookings = await index.getAll(userId)

    // Ensure we always return an array
    return Array.isArray(bookings) ? bookings : []
  } catch (error) {
    console.error("Error getting user bookings:", error)
    return [] // Return empty array on error
  }
}

// Payment operations
export async function savePayment(payment: any) {
  const db = await openDB()
  const tx = db.transaction(STORES.PAYMENTS, "readwrite")
  const store = tx.objectStore(STORES.PAYMENTS)
  const paymentId = await store.add(payment)

  // Schedule sync when online
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready
    await registration.sync.register("sync-payments")
  }

  await tx.complete
  return paymentId
}

// Map operations
export async function saveMapTile(mapTile: any) {
  const db = await openDB()
  const tx = db.transaction(STORES.MAPS, "readwrite")
  const store = tx.objectStore(STORES.MAPS)
  await store.put(mapTile)
  return tx.complete
}

export async function getMapTile(id: string) {
  const db = await openDB()
  const tx = db.transaction(STORES.MAPS, "readonly")
  const store = tx.objectStore(STORES.MAPS)
  return store.get(id)
}

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

// Helper to open the database
async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }
  })
}

// Initialize data
export async function initializeData() {
  try {
    // Create fallback data in case fetching fails
    const fallbackParkingSpots = {
      spots: [
        {
          id: "p1",
          name: "MG Road Parking",
          address: "MG Road, Bangalore",
          description: "Public parking near MG Road Metro Station",
          lat: 12.9747,
          lng: 77.6138,
          price: 20,
          priceUnit: "hour",
          currency: "₹",
          totalSpots: 50,
          availableSpots: 12,
          type: "outdoor",
          security: true,
          cctv: true,
          covered: false,
          handicapped: true,
          ev: false,
          hours: "24/7",
          rating: 4.2,
          reviews: 120,
          images: ["/images/parking/parking1.jpg"],
        },
        {
          id: "p2",
          name: "Forum Mall Parking",
          address: "Koramangala, Bangalore",
          description: "Multi-level parking at Forum Mall",
          lat: 12.9346,
          lng: 77.6146,
          price: 40,
          priceUnit: "hour",
          currency: "₹",
          totalSpots: 200,
          availableSpots: 45,
          type: "indoor",
          security: true,
          cctv: true,
          covered: true,
          handicapped: true,
          ev: true,
          hours: "10:00 AM - 10:00 PM",
          rating: 4.5,
          reviews: 230,
          images: ["/images/parking/parking2.jpg"],
        },
      ],
    }

    const fallbackCities = {
      cities: [
        {
          id: "bangalore",
          name: "Bangalore",
          state: "Karnataka",
          lat: 12.9716,
          lng: 77.5946,
          zoom: 12,
        },
        {
          id: "mumbai",
          name: "Mumbai",
          state: "Maharashtra",
          lat: 19.076,
          lng: 72.8777,
          zoom: 12,
        },
      ],
    }

    // Try to load parking spots from JSON
    let parkingSpotsData
    try {
      const parkingSpotsResponse = await fetch("/data/parking-spots.json")
      if (!parkingSpotsResponse.ok) {
        throw new Error(`Failed to fetch parking spots: ${parkingSpotsResponse.status}`)
      }
      const contentType = parkingSpotsResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response for parking spots")
      }
      parkingSpotsData = await parkingSpotsResponse.json()
    } catch (error) {
      console.warn("Using fallback parking spots data:", error)
      parkingSpotsData = fallbackParkingSpots
    }

    // Try to load cities from JSON
    let citiesData
    try {
      const citiesResponse = await fetch("/data/cities.json")
      if (!citiesResponse.ok) {
        throw new Error(`Failed to fetch cities: ${citiesResponse.status}`)
      }
      const contentType = citiesResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response for cities")
      }
      citiesData = await citiesResponse.json()
    } catch (error) {
      console.warn("Using fallback cities data:", error)
      citiesData = fallbackCities
    }

    // Save the data to IndexedDB
    await saveParkingSpots(parkingSpotsData.spots)
    await saveCities(citiesData.cities)

    return true
  } catch (error) {
    console.error("Error initializing data:", error)
    return false
  }
}

