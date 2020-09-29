import React from 'react'

import styles from './Close.module.sass'

export default () => (
  <>
    <svg className={styles.bottom}>
      <use xlinkHref="static/icons.svg#close" />
    </svg>
    <svg className={styles.top}>
      <use xlinkHref="static/icons.svg#close" />
    </svg>
  </>
)
