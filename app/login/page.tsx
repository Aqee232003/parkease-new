import { LoginForm } from "@/components/login-form"
import { OfflineStatus } from "@/components/offline-status"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your ParkEase account</p>
          </div>

          <OfflineStatus />
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

