// external libraries
import React from 'react'

// other components
import LayoutContext from './LayoutContext'
import Header from './header/Header'

const headerHeight = 48

const Layout: React.FunctionComponent = ({ children }) => {
  const [yOffset, setYOffset] = React.useState(0)

  const setter = (newValue: number): void => {
    console.log('Setting new yOffset value to', headerHeight + newValue)
    setYOffset(newValue)
  }

  return (
    <LayoutContext.Provider
      value={{
        scrollYOffset: yOffset + headerHeight,
        setScrollYOffset: setter,
      }}
    >
      <Header />
      {children}
    </LayoutContext.Provider>
  )
}

export default Layout
