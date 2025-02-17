"use client"

import type React from "react"

import { createContext, useContext, useRef } from "react"

type SoundEffectType = "hover" | "click" | "process" | "complete"

interface SoundContextType {
  playSound: (type: SoundEffectType) => void
}

const SoundContext = createContext<SoundContextType>({ playSound: () => {} })

export function useSoundEffects() {
  return useContext(SoundContext)
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const hoverSound = useRef<HTMLAudioElement>(null)
  const clickSound = useRef<HTMLAudioElement>(null)
  const processSound = useRef<HTMLAudioElement>(null)
  const completeSound = useRef<HTMLAudioElement>(null)

  const playSound = (type: SoundEffectType) => {
    const sounds = {
      hover: hoverSound.current,
      click: clickSound.current,
      process: processSound.current,
      complete: completeSound.current,
    }

    const sound = sounds[type]
    if (sound) {
      sound.currentTime = 0
      sound.play().catch(() => {})
    }
  }

  return (
    <SoundContext.Provider value={{ playSound }}>
      <audio ref={hoverSound} src="/sounds/hover.mp3" preload="auto" />
      <audio ref={clickSound} src="/sounds/click.mp3" preload="auto" />
      <audio ref={processSound} src="/sounds/process.mp3" preload="auto" />
      <audio ref={completeSound} src="/sounds/complete.mp3" preload="auto" />
      {children}
    </SoundContext.Provider>
  )
}

