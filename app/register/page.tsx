import { RegisterForm } from "@/components/register-form"
import { OfflineStatus } from "@/components/offline-status"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-2">Sign up to start using ParkEase</p>
          </div>

          <OfflineStatus />
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

