// this whole component is simply a wrapper around the Image component
// that handles the ugly, imperative, I/O stuff; testing it is more
// trouble than it's worth since it relies entirely on outside 
// libraries that are assumed to be thoroughly tested & internal 
// modules that are thoroughly tested on their own.
/*istanbul ignore file*/
import React from 'react'
import 'lazysizes'

import fetch, { Image as ImageType } from '../../lib/data/fetch'
import Image from './Image'

interface Props {
  cardId: string
  attachmentId: string
  size?: { height?: number; width?: number } | null
}

export default ({ cardId, attachmentId, size = null }: Props) => {
  const [imgData, setImgData] = React.useState<ImageType | null>(null)

  // skipping useEffect in testing; we don't need to know that this
  // particular fetch call works -- fetch has already been tested
  // thoroughly
  /*istanbul ignore next*/
  React.useEffect(() => {
    if (size) {
      fetch
        .image(cardId, attachmentId, size)
        .then((res) => setImgData(res.unwrap()))
    } else {
      fetch.image(cardId, attachmentId).then((res) => setImgData(res.unwrap()))
    }
  }, [])

  return <>{imgData !== null ? <Image data={imgData} /> : null}</>
}
