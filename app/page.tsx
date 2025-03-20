import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Car, CreditCard, WifiOff } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">ParkEase</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Find and book parking spots even without internet. The fully offline parking solution for Indian cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Parking</h3>
              <p className="text-gray-600">
                Discover nearby parking spots using pre-cached maps that work even offline.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <Car className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
              <p className="text-gray-600">
                Reserve your spot with QR code check-in that works without internet connection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay Later</h3>
              <p className="text-gray-600">
                Use our offline-first payment system with UPI integration when you're back online.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <WifiOff className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Offline</h3>
              <p className="text-gray-600">
                The app works entirely offline after first load, perfect for underground parking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect for Indian Cities</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="ParkEase App Demo"
                className="rounded-lg shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <span className="font-bold text-indigo-600">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Download Once, Use Forever</h3>
                  <p className="text-gray-600">Install as a PWA and use it even in areas with poor connectivity.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <span className="font-bold text-indigo-600">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Works Underground</h3>
                  <p className="text-gray-600">
                    No signal in basement parking? No problem! ParkEase works without internet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <span className="font-bold text-indigo-600">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Save Data & Battery</h3>
                  <p className="text-gray-600">
                    Optimized for low-end devices with minimal data usage and battery consumption.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <span className="font-bold text-indigo-600">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Syncs When Ready</h3>
                  <p className="text-gray-600">All your data syncs automatically when you're back online.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Park Smarter?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Download ParkEase now and experience hassle-free parking, even offline.
          </p>
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
            Install App
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">ParkEase</h3>
              <p className="text-gray-400">The offline parking solution</p>
            </div>

            <div className="flex gap-6">
              <Link href="/about" className="hover:text-indigo-300">
                About
              </Link>
              <Link href="/privacy" className="hover:text-indigo-300">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-indigo-300">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-indigo-300">
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ParkEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

