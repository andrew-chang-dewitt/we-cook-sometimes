// external libraries
import React from 'react'

// internal utilities
//
// importing useIO hook as object to allow for it to be
// stubbed in tests
import * as hook from '../../utils/useAutoPause'

// core logic
import { ImageAPI } from '../../lib/data/fetch'

// other components
import Image from '../images/Image'
import Video from '../images/Video'
import Next from '../icons/Next'
import Previous from '../icons/Previous'
import Pause from '../icons/Pause'
import Play from '../icons/Play'

// CSS-modules
import styles from './ImageCarousel.module.sass'

// get a file extension from a given string
const getExtension = (url: string): string => {
  const split = url.split('.')
  return split[split.length - 1]
}

// check if a given attachment is an image or video by
// assuming it's file type by the URL ending
export const isImage = (item: ImageAPI): boolean => {
  const images = ['jpg', 'JPG', 'jpeg', 'png', 'PNG']

  return images.includes(getExtension(item.url))
}
export const isVideo = (item: ImageAPI): boolean => {
  const videos = ['mp4', 'MOV']

  return videos.includes(getExtension(item.url))
}

interface Props {
  attachments: Array<ImageAPI>
}

export default ({ attachments }: Props) => {
  // early return to guard against there being no attachments
  if (attachments.length === 0) return <></>

  // track current item in carousel using an index stored
  // as `current` in React state
  const [current, setCurrent] = React.useState(0)
  // track if a video is playing
  const [isPlaying, setPlaying] = React.useState(false)
  // get access to actual video DOM elements
  const video = React.useRef<HTMLVideoElement>(null)
  // & set up an IntersectionObserver to track the ref
  // const videoObserver = hook.useIntersectionObserver<HTMLVideoElement>(video, {
  //   threshold: 1,
  // })

  /*
   * onClick handlers
   *
   */
  const next = (): void => {
    setCurrent(current + 1)
  }
  const previous = (): void => {
    setCurrent(current - 1)
  }
  const play = () => {
    // current property is possibly null, but the button that
    // calls this handler is never available if current is null,
    // so no need to test the else path
    /* istanbul ignore else */
    if (video.current) {
      video.current.play()
      setPlaying(true)
    }
  }
  const pause = () => {
    // current property is possibly null, but the button that
    // calls this handler is never available if current is null,
    // so no need to test the else path
    /* istanbul ignore else */
    if (video.current) {
      video.current.pause()
      setPlaying(false)
    }
  }

  hook.useAutoPause(video, play, pause)

  // // wait for the Intersection Observer on the video element to
  // // update it's isIntersecting property
  // // play if it's visible, & pause if it's not fully visible
  // React.useEffect(() => {
  //   videoObserver.isIntersecting ? play() : pause()
  // }, [videoObserver.isIntersecting])

  // retain playing state when the current image is changed;
  // if a video was playing when next or previous was clicked,
  // the next video seen will also play;
  // if a video was paused, the next will also be paused
  React.useEffect(() => {
    if (video.current) {
      // unable to test this as JSDOM doesn't implement `play()` &
      // `pause()` methods of video elements & I'm unable to stub
      // them in a way that also changes the value of a video's
      // `paused` property
      /* istanbul ignore next */
      if (isPlaying && video.current.paused) play()
    }
  }, [current])

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          aria-label="Previous Image"
          onClick={previous}
          disabled={current === 0}
        >
          <Previous />
        </button>

        {isVideo(attachments[current]) ? (
          isPlaying ? (
            <button aria-label="Pause Video" onClick={() => pause()}>
              <Pause />
            </button>
          ) : (
            <button aria-label="Play Video" onClick={() => play()}>
              <Play />
            </button>
          )
        ) : null}

        <button
          aria-label="Next Image"
          onClick={next}
          disabled={current === attachments.length - 1}
        >
          <Next />
        </button>
      </div>

      {isImage(attachments[current]) ? (
        <Image data={attachments[current]} lazy={current === 0} />
      ) : null}
      {isVideo(attachments[current]) ? (
        <Video data={attachments[current]} ref={video} />
      ) : null}
    </div>
  )
}
