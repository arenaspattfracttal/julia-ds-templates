"use client"

import { createContext, useContext } from "react"

export type ScreenMode = "desktop" | "tablet" | "mobile"

const ScreenModeContext = createContext<ScreenMode>("desktop")

export function ScreenModeProvider({
  mode,
  children,
}: {
  mode:     ScreenMode
  children: React.ReactNode
}) {
  return (
    <ScreenModeContext.Provider value={mode}>
      {children}
    </ScreenModeContext.Provider>
  )
}

export function useScreenMode(): ScreenMode {
  return useContext(ScreenModeContext)
}
