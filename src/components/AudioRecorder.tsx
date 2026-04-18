"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"

const AUDIO_LEVEL_BUCKETS = 5

interface AudioRecorderProps {
  disabled?: boolean
  onError?: (message: string) => void
  onRecordingStateChange?: (isRecording: boolean) => void
  onRecordingComplete: (blob: Blob) => void | Promise<void>
  children: (props: {
    audioLevels: number[]
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
  const [audioLevels, setAudioLevels] = useState<number[]>(() =>
    Array.from({ length: AUDIO_LEVEL_BUCKETS }, () => 0)
  )
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const frequencyDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null)

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && Boolean(window.MediaRecorder && navigator.mediaDevices?.getUserMedia))

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      analyserRef.current?.disconnect()
      sourceRef.current?.disconnect()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      audioContextRef.current?.close().catch(() => {})
      audioContextRef.current = null
      analyserRef.current = null
      sourceRef.current = null
      streamRef.current = null
      mediaRecorderRef.current = null
    }
  }, [])

  const updateRecordingState = (nextValue: boolean) => {
    setIsRecording(nextValue)
    onRecordingStateChange?.(nextValue)
  }

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    analyserRef.current?.disconnect()
    sourceRef.current?.disconnect()
    analyserRef.current = null
    sourceRef.current = null
    frequencyDataRef.current = null
    setAudioLevels(Array.from({ length: AUDIO_LEVEL_BUCKETS }, () => 0))

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
  }

  const startAudioAnalysis = (stream: MediaStream) => {
    const AudioContextConstructor =
      typeof window === "undefined"
        ? undefined
        : window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioContextConstructor) {
      return
    }

    stopAudioAnalysis()

    const audioContext = new AudioContextConstructor()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)

    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.72
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    sourceRef.current = source
    frequencyDataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))

    const updateAudioLevels = () => {
      const currentAnalyser = analyserRef.current
      const frequencyData = frequencyDataRef.current

      if (!currentAnalyser || !frequencyData) {
        return
      }

      currentAnalyser.getByteFrequencyData(frequencyData)

      const bucketSize = Math.max(1, Math.floor(frequencyData.length / AUDIO_LEVEL_BUCKETS))
      const nextLevels = Array.from({ length: AUDIO_LEVEL_BUCKETS }, (_, index) => {
        const start = index * bucketSize
        const end =
          index === AUDIO_LEVEL_BUCKETS - 1
            ? frequencyData.length
            : Math.min(frequencyData.length, start + bucketSize)

        if (start >= end) {
          return 0
        }

        let total = 0
        for (let cursor = start; cursor < end; cursor += 1) {
          total += frequencyData[cursor]
        }

        const average = total / (end - start)
        return Math.min(1, average / 255)
      })

      setAudioLevels(nextLevels)
      animationFrameRef.current = requestAnimationFrame(updateAudioLevels)
    }

    animationFrameRef.current = requestAnimationFrame(updateAudioLevels)
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
      startAudioAnalysis(stream)

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
        stopAudioAnalysis()
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
      stopAudioAnalysis()
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

  return <>{children({ audioLevels, isRecording, isSupported, startRecording, stopRecording })}</>
}
