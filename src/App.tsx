import React, { useState, useEffect, useCallback } from 'react'
import PinLogin from '@/components/ui/PinLogin'
import HomePage from '@/pages/HomePage'
import FontSizeWidget from '@/components/ui/FontSizeWidget'
import { isSessionValid, signOut } from '@/utils/auth'
import { loadFontLevel, saveFontLevel, applyFontLevel, type FontLevel } from '@/utils/fontScale'
import { useStore } from '@/store'
import { getTheme } from '@/utils/theme'

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [fontLevel, setFontLevel]         = useState<FontLevel>(loadFontLevel)
  const dark  = useStore(s => s.dark)
  const theme = getTheme(dark)

  // Apply font scale on mount and change
  useEffect(() => {
    applyFontLevel(fontLevel)
  }, [fontLevel])

  // Check session on mount
  useEffect(() => {
    if (isSessionValid()) setAuthenticated(true)
  }, [])

  const handleAuthenticated = useCallback(() => {
    setAuthenticated(true)
  }, [])

  const handleSignOut = useCallback(() => {
    signOut()
    setAuthenticated(false)
  }, [])

  const handleFontChange = useCallback((level: FontLevel) => {
    setFontLevel(level)
    saveFontLevel(level)
    applyFontLevel(level)
  }, [])

  if (!authenticated) {
    return <PinLogin onAuthenticated={handleAuthenticated} dark={dark} />
  }

  return (
    <>
      <HomePage onSignOut={handleSignOut} />
      <FontSizeWidget level={fontLevel} onChange={handleFontChange} theme={theme} />
    </>
  )
}

export default App
