import React from 'react'
import 'lazysizes'

import { image, Image } from '../lib/data/fetch'

import styles from './Image.module.sass'

interface Props {
  cardId: string
  attachmentId: string
  size?: { height?: number; width?: number } | null
}

export default ({ cardId, attachmentId, size = null }: Props) => {
  const [imgData, setImgData] = React.useState<Image | null>(null)

  React.useEffect(() => {
    if (size) {
      image(cardId, attachmentId, size).then((res) => setImgData(res.unwrap()))
    } else {
      image(cardId, attachmentId).then((res) => setImgData(res.unwrap()))
    }
  }, [])

  // FIXME: add alt text to images somehow, maybe from image name?
  return (
    <>
      {imgData !== null ? (
        <img
          className={`${styles.img} lazyload`}
          alt={imgData.name}
          data-src={imgData.url}
          style={{ backgroundColor: imgData.edgeColor }}
        />
      ) : null}
    </>
  )
}
