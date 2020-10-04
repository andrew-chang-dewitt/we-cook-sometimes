import React from 'react'

import { useIntersectionObserver } from './useIntersectionObserver'

export const useAutoPause = (
  videoRef: React.RefObject<HTMLVideoElement>,
  playHandler: () => void,
  pauseHandler: () => void
) => {
  // & set up an IntersectionObserver to track the ref
  const videoObserver = useIntersectionObserver<HTMLVideoElement>(videoRef, {
    threshold: 1,
  })

  // wait for the Intersection Observer on the video element to
  // update it's isIntersecting property
  // play if it's visible, & pause if it's not fully visible
  React.useEffect(() => {
    videoObserver.isIntersecting ? playHandler() : pauseHandler()
  }, [videoObserver.isIntersecting])
}
