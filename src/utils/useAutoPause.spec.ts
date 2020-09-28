// testing tools
import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { renderHook, cleanup } from '@testing-library/react-hooks'

// dependencies
import * as hook from './useIntersectionObserver'

// hook under test
import { useAutoPause } from './useAutoPause'

describe('utils/useAutoPause', () => {
  let useIOStub: SinonStub<any, any>

  const videoRefFake = {
    current: {
      play: () => {},
      pause: () => {},
      paused: true,
    },
  } as React.RefObject<HTMLVideoElement>
  const playSpy = sinon.spy()
  const pauseSpy = sinon.spy()

  const setup = () => {
    renderHook(() => useAutoPause(videoRefFake, playSpy, pauseSpy))
  }

  before(() => {
    useIOStub = sinon.stub(hook, 'useIntersectionObserver')
  })
  afterEach(() => {
    sinon.resetHistory()
    cleanup()
  })
  after(() => {
    sinon.restore()
  })

  it('sets up an Intersection Observer on the given video reference', () => {
    setup()

    expect(useIOStub.calledWith(videoRefFake)).to.be.true
  })

  it('plays the video if IO states the entire video is visible', () => {
    // fake that IO returns a value indicating video is visible
    useIOStub.returns({
      isIntersecting: true,
    } as IntersectionObserverEntry)

    // then execute the hook
    setup()

    // & expect play handler to have been called
    expect(playSpy.calledOnce).to.be.true
  })

  it('pauses the video if IO states the entire video is not visible', () => {
    // fake that IO returns a value indicating video is not visible
    useIOStub.returns({
      isIntersecting: false,
    } as IntersectionObserverEntry)

    // then execute the hook
    setup()

    // & expect play handler to have been called
    expect(pauseSpy.calledOnce).to.be.true
  })
})
