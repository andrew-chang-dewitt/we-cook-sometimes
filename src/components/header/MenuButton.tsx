// external dependencies
import React from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'

// other components
import HamburgerIcon from '../icons/HamburgerIcon'

export default () => {
  const [open, setOpen] = React.useState(false)
  const history = useHistory()
  const location = useLocation()

  const closeMenuButtonHandler = (): void => {
    history.goBack()
  }

  const menuClosed = (
    <button aria-label="Open navigation menu">
      <Link to="/menu">
        <HamburgerIcon open={false} />
      </Link>
    </button>
  )

  const menuOpened = (
    <button aria-label="Close navigation Menu" onClick={closeMenuButtonHandler}>
      <HamburgerIcon open={true} />
    </button>
  )

  React.useEffect(() => {
    location.pathname === '/menu' ? setOpen(true) : setOpen(false)
  }, [location])

  return open ? menuOpened : menuClosed
}
