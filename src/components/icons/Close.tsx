// there's 0 logic here, this is simply just an encapsulation
// of a reusable see more (vertical ellipsis) icon, no need to 
// any of it
/* istanbul ignore file */
import React from 'react'

import styles from './Close.module.sass'

export default () => (
  <>
    <svg className={styles.bottom}>
      <title>Close</title>
      <use xlinkHref="static/icons.svg#close" />
    </svg>
    <svg className={styles.top} aria-hidden="true">
      <use xlinkHref="static/icons.svg#close" />
    </svg>
  </>
)
