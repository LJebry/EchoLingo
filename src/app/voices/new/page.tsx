import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { VoiceProfilePage } from "@/components/voices/VoiceProfilePage"

export default async function NewVoiceProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  return <VoiceProfilePage />
}
