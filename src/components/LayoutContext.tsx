import React from 'react'

interface LayoutConstants {
  scrollYOffset: number
  setScrollYOffset: (newValue: number) => void
}

export default React.createContext<LayoutConstants>({
  scrollYOffset: 0,
  setScrollYOffset: (_) => {},
})
