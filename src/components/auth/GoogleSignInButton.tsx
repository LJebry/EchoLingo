import { Chrome } from "lucide-react"
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/Button"

interface GoogleSignInButtonProps {
  redirectTo?: string
  className?: string
}

export function GoogleSignInButton({
  redirectTo = "/dashboard",
  className,
}: GoogleSignInButtonProps) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo })
      }}
      className={className}
    >
      <Button variant="primary" size="lg" className="w-full flex gap-3">
        <Chrome size={20} />
        Continue with Google
      </Button>
    </form>
  )
}
