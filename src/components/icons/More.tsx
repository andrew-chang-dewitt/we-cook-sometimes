// there's 0 logic here, this is simply just an encapsulation
// of a reusable see more (vertical ellipsis) icon, no need to
// any of it
/* istanbul ignore file */
import React from 'react'

import styles from './More.module.sass'

export default () => (
  <svg className={styles.svgIcon}>
    <title>See more...</title>
    <use xlinkHref="static/icons.svg#ellipsis-vertical" />
  </svg>
)
