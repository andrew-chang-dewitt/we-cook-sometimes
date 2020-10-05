import React from 'react'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'

import { Image } from '../../lib/data/fetch'

import styles from './Image.module.sass'

interface Props {
  data: Image
}

export default React.forwardRef<HTMLVideoElement, Props>(({ data }, ref) => (
  <video
    ref={ref}
    className={styles.video}
    style={{ backgroundColor: data.edgeColor }}
    src={data.url}
    muted
    loop
  />
))
