"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, MessageSquare, Trash2 } from "lucide-react"

type ConversationListItem = {
  id: string
  title: string
  updatedAt: string
  turns: number
}

export function ConversationHistoryList({ conversations }: { conversations: ConversationListItem[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function deleteConversation(conversation: ConversationListItem) {
    const confirmed = window.confirm(`Delete "${conversation.title}" from history?`)
    if (!confirmed) {
      return
    }

    setDeletingId(conversation.id)
    setError("")

    try {
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "Unable to delete this conversation.")
      }

      router.refresh()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this conversation.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-2xl border border-red-300/10 bg-red-950/20 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {conversations.map((conversation) => {
        const isDeleting = deletingId === conversation.id

        return (
          <div
            key={conversation.id}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-[#b9c7df]/5 bg-[#131b2e] p-4"
          >
            <Link
              href={`/conversations/${conversation.id}`}
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3c0091]/10 text-[#d0bcff] transition-colors group-hover:bg-[#3c0091]/20">
                <MessageSquare size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="truncate font-bold text-[#dae2fd]">{conversation.title}</h4>
                <p className="text-xs text-[#b9c7df]/40">
                  {conversation.turns} turns • {new Date(conversation.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/conversations/${conversation.id}`}
                className="hidden text-[#b9c7df]/20 transition-colors group-hover:text-[#d0bcff]/40 sm:block"
                aria-label={`Open ${conversation.title}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
              <button
                type="button"
                onClick={() => {
                  void deleteConversation(conversation)
                }}
                disabled={isDeleting}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-300/10 bg-red-950/20 text-red-200 transition-colors hover:bg-red-900/30 disabled:cursor-wait disabled:opacity-60"
                aria-label={`Delete ${conversation.title}`}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
