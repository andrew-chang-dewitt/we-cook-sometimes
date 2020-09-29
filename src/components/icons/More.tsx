import React from 'react'

import styles from './More.module.sass'

export default () => (
  <svg className={styles.svgIcon}>
    <title>See more...</title>
    <use xlinkHref="static/icons.svg#ellipsis-vertical" />
  </svg>
)
