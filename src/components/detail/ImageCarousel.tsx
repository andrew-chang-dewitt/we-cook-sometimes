import React from 'react'

import { ImageAPI } from '../../lib/data/fetch'
import Image from '../images/Image'
import Video from '../images/Video'

import styles from './ImageCarousel.module.sass'

const getExtension = (url: string): string => {
  const split = url.split('.')
  return split[split.length - 1]
}

export const isImage = (item: ImageAPI): boolean => {
  const images = ['jpg', 'JPG', 'jpeg', 'png', 'PNG']

  return images.includes(getExtension(item.url))
}

export const isVideo = (item: ImageAPI): boolean => {
  const videos = ['mp4', 'MOV']

  return videos.includes(getExtension(item.url))
}

const imageOrVideo = (item: ImageAPI) => {
  if (isImage(item)) return <Image data={item} />
  if (isVideo(item)) return <Video data={item} />
  return null
}

interface Props {
  attachments: Array<ImageAPI>
}

export default ({ attachments }: Props) => {
  const [current, setCurrent] = React.useState(0)

  const next = (): void => {
    setCurrent(current + 1)
  }

  const previous = (): void => {
    setCurrent(current - 1)
  }

  return (
    <div className={styles.container}>
      {imageOrVideo(attachments[current])}
      <div>
        <button
          aria-label="Previous Image"
          onClick={previous}
          disabled={current === 0}
        >
          Previous
        </button>
        <button
          aria-label="Next Image"
          onClick={next}
          disabled={current === attachments.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
