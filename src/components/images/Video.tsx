import React from 'react'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'

import { Image } from '../../lib/data/fetch'

import styles from './Image.module.sass'

interface Props {
  data: Image
}

export default ({ data }: Props) => (
  <>
    <video
      className={`${styles.video} lazyload`}
      style={{ backgroundColor: data.edgeColor }}
      data-src={data.url}
      preload="metadata"
      muted
      controls
    />
  </>
)
