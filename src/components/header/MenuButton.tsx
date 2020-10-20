// external dependencies
import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// other components
import HamburgerIcon from '../icons/HamburgerIcon'

// CSS-modules
import styles from './MenuButton.module.sass'

export default () => {
  const [open, setOpen] = React.useState(false)
  const history = useHistory()
  const location = useLocation()

  const openMenuButtonHandler = (): void => {
    history.push('/menu')
  }
  const closeMenuButtonHandler = (): void => {
    history.goBack()
  }

  const menuClosed = (
    <button
      aria-label="Open navigation menu"
      onClick={openMenuButtonHandler}
      className={styles.button}
    >
      <HamburgerIcon open={false} />
    </button>
  )

  const menuOpened = (
    <button
      aria-label="Close navigation Menu"
      onClick={closeMenuButtonHandler}
      className={styles.button}
    >
      <HamburgerIcon open={true} />
    </button>
  )

  React.useEffect(() => {
    location.pathname === '/menu' ? setOpen(true) : setOpen(false)
  }, [location])

  return open ? menuOpened : menuClosed
}
