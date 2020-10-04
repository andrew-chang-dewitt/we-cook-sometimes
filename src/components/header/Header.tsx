// external dependencies
import React from 'react'
import { Link } from 'react-router-dom'

// other components
import BackButton from './BackButton'

// CSS-modules
import styles from './Header.module.sass'

export default () => (
  <div className={styles.container}>
    <div className={styles.backButton}>
      <BackButton />
    </div>
    <div className={styles.branding}>
      <Link to="/">We Cook Sometimes</Link>
    </div>
    <div className={styles.menuButton}></div>
  </div>
)
