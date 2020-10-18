// external dependencies
import React from 'react'
//
// other components
import MenuButton from './MenuButton'

// CSS-modules
import styles from './Header.module.sass'

export default () => (
  <div className={styles.container}>
    {/* branding left blank until we decide we actually
     * want to use this instead of it just being a
     * portfolio project
     */}
    <div className={styles.branding}></div>
    <div className={styles.menuButton}>
      <MenuButton />
    </div>
  </div>
)
