import React from 'react'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'

import { Image } from '../../lib/data/fetch'

import styles from './Image.module.sass'

interface Props {
  data: Image
}

const useAutoPause = (video: React.RefObject<HTMLVideoElement>): void => {
  React.useEffect(() => {
    let isPaused = false

    const observer = new IntersectionObserver(
      (entries: Array<IntersectionObserverEntry>) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLVideoElement

          console.log(entry)
          console.log(el)

          if (entry.intersectionRatio !== 1 && !isPaused) {
            el.pause()
            isPaused = true
          } else if (isPaused) {
            el.play()
            isPaused = false
          }
        })
      },
      { threshold: 1 }
    )

    if (video.current) observer.observe(video.current)

    return () => observer.disconnect()
  }, [video])
}

export default ({ data }: Props) => {
  const video = React.useRef<HTMLVideoElement>(null)
  useAutoPause(video)

  return (
    <>
      <video
        ref={video}
        className={styles.video}
        style={{ backgroundColor: data.edgeColor }}
        src={data.url}
        muted
        loop
        controls
      />
    </>
  )
}
