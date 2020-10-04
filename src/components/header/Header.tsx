// external dependencies
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// other components
import BackButton from './BackButton'
import MenuButton from './MenuButton'

// CSS-modules
import styles from './Header.module.sass'

export default () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        {location.pathname !== '/' ? <BackButton /> : null}
      </div>
      <div className={styles.branding}>
        <Link to="/">We Cook Sometimes</Link>
      </div>
      <div className={styles.menuButton}>
        <MenuButton open={menuOpen} handler={toggleMenu} />
      </div>
    </div>
  )
}
