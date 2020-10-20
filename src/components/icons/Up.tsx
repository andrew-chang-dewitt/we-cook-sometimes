// there's 0 logic here, this is simply just an encapsulation
// of a reusable see more (vertical ellipsis) icon, no need to
// any of it
/* istanbul ignore file */
import React from 'react'

import styles from './NextPrevious.module.sass'

export default () => (
  <svg className={styles.svgIcon}>
    <use xlinkHref="/static/icons.svg#chevron-up" />
  </svg>
)
