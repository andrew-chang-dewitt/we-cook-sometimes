// external dependencies
import React from 'react'

// other components
import Help from './icons/Help'

// CSS-modules
import styles from './WIPTag.module.sass'

export default () => (
  <span className={styles.nowrap}>
    {' '}
    [WIP]
    <Help />
  </span>
)
