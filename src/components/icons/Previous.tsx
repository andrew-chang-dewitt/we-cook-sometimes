import React from 'react'

import styles from './NextPrevious.module.sass'

export default () => (
  <svg className={styles.svgIcon}>
    <use xlinkHref="/static/icons.svg#chevron-left" />
  </svg>
)
