import { Button } from "@/components/ui/Button"
import { signIn } from "@/lib/auth"
import { Chrome } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-manrope font-bold text-[#dae2fd]">Welcome back</h1>
        <p className="text-[#b9c7df]/60">Sign in to access your saved conversations and voices.</p>
      </div>

      <form
        action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/dashboard" })
        }}
        className="w-full"
      >
        <Button variant="primary" size="lg" className="w-full flex gap-3">
          <Chrome size={20} />
          Continue with Google
        </Button>
      </form>

      <p className="text-sm text-[#b9c7df]/40">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  )
}
