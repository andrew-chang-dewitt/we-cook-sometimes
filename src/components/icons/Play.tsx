import React from 'react'

import styles from './PlayPause.module.sass'

export default () => (
  <svg className={styles.svgIcon}>
    <use xlinkHref="/static/icons.svg#play" />
  </svg>
)
