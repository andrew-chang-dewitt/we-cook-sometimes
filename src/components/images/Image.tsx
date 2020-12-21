import React from 'react'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'

import { Image } from '../../lib/data/schema'

import styles from './Image.module.sass'

interface Props {
  data: Image
  lazy?: boolean
}

export default ({ data, lazy = true }: Props) => (
  <>
    {lazy ? (
      <img
        className={`${styles.img} lazyload`}
        alt={data.name}
        data-src={data.url}
        style={{ backgroundColor: data.edgeColor }}
      />
    ) : (
      <img
        className={`${styles.img}`}
        alt={data.name}
        src={data.url}
        style={{ backgroundColor: data.edgeColor }}
      />
    )}
  </>
)
