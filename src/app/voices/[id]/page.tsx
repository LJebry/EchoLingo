import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { VoiceProfilePage } from "@/components/voices/VoiceProfilePage"
import { getUserSpeakerProfileById } from "@/lib/services/speaker-profiles"

export default async function EditVoiceProfilePage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const profile = await getUserSpeakerProfileById(params.id, session.user.id)
  if (!profile) redirect("/voices")

  return (
    <VoiceProfilePage
      mode="edit"
      profileId={profile.id}
      initialValues={{
        displayName: profile.displayName,
        sourceLanguage: profile.sourceLanguage,
        targetLanguage: profile.targetLanguage,
        elevenLabsVoiceId: profile.elevenLabsVoiceId,
      }}
    />
  )
}
