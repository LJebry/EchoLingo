"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"

interface AudioRecorderProps {
  disabled?: boolean
  onError?: (message: string) => void
  onRecordingStateChange?: (isRecording: boolean) => void
  onRecordingComplete: (blob: Blob) => void | Promise<void>
  children: (props: {
    isRecording: boolean
    isSupported: boolean
    startRecording: () => Promise<void>
    stopRecording: () => void
  }) => ReactNode
}

export default function AudioRecorder({
  disabled = false,
  onError,
  onRecordingStateChange,
  onRecordingComplete,
  children,
}: AudioRecorderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && Boolean(window.MediaRecorder && navigator.mediaDevices?.getUserMedia))

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      mediaRecorderRef.current = null
    }
  }, [])

  const updateRecordingState = (nextValue: boolean) => {
    setIsRecording(nextValue)
    onRecordingStateChange?.(nextValue)
  }

  const startRecording = async () => {
    if (disabled || !isSupported || isRecording) {
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      chunksRef.current = []
      streamRef.current = stream
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      })

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        })

        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        mediaRecorderRef.current = null
        chunksRef.current = []
        updateRecordingState(false)

        if (audioBlob.size > 0) {
          await onRecordingComplete(audioBlob)
        }
      })

      mediaRecorder.start()
      updateRecordingState(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to access microphone."
      onError?.(message)
      updateRecordingState(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  return <>{children({ isRecording, isSupported, startRecording, stopRecording })}</>
}
