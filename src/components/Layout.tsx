// external libraries
import React from 'react'

// other components
import LayoutContext from './LayoutContext'
import Header from './header/Header'

const headerHeight = 48

const Layout: React.FunctionComponent = ({ children }) => {
  const [yOffset, setYOffset] = React.useState(0)

  return (
    <LayoutContext.Provider
      value={{
        scrollYOffset: yOffset + headerHeight,
        setScrollYOffset: setYOffset,
      }}
    >
      <Header />
      {children}
    </LayoutContext.Provider>
  )
}

export default Layout
