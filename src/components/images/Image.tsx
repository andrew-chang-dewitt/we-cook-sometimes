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
    <img
      className={`${styles.img} lazyload`}
      alt={data.name}
      data-src={data.url}
      style={{ backgroundColor: data.edgeColor }}
    />
  </>
)
