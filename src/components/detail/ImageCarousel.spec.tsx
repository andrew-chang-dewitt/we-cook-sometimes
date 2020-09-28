// testing tools
import 'mocha'
import { expect, use } from 'chai'
import { default as chaiDom } from 'chai-dom'
use(chaiDom)
import sinon, { SinonStub } from 'sinon'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// dependencies
import { ImageAPI } from '../../lib/data/fetch'
import * as hook from '../../utils/useAutoPause'

// component under test
import ImageCarousel from './ImageCarousel'

describe('src/component/detail/ImageCarousel', () => {
  // interface CustomMockSetup {
  //   restore: () => void
  // }
  // // Mocking Intersection Observer behaviour
  // const setupMutationObserverMock = (): CustomMockSetup => {
  //   class MutationObserver {}

  //   const oldObj = MutationObserver ? MutationObserver : null

  //   const restore = () => {
  //     Object.defineProperty(window, 'MutationObserver', {
  //       writable: true,
  //       configurable: true,
  //       value: oldObj,
  //     })
  //   }

  //   Object.defineProperty(window, 'MutationObserver', {
  //     writable: true,
  //     configurable: true,
  //     value: MutationObserver,
  //   })

  //   return { restore: restore }
  // }

  let playStub: SinonStub<any, any>
  let pauseStub: SinonStub<any, any>

  let nextImage: HTMLElement
  let previousImage: HTMLElement

  let useAutoPauseStub: SinonStub<any, any>

  const attachments = [
    {
      name: 'name1',
      url: 'url1.jpeg',
    },
    {
      name: 'name2',
      url: 'url2.jpeg',
    },
    {
      name: 'name3',
      url: 'url3.jpeg',
    },
  ] as Array<ImageAPI>

  const setup = (): void => {
    render(<ImageCarousel attachments={attachments} />)
    nextImage = screen.getByRole('button', { name: /next image/i })
    previousImage = screen.getByRole('button', { name: /previous image/i })
  }

  beforeEach(() => {
    // mockMutationObserver = setupMutationObserverMock()
    useAutoPauseStub = sinon.stub(hook, 'useAutoPause')
  })
  afterEach(() => {
    // mockMutationObserver.restore()
    useAutoPauseStub.restore()

    cleanup()
  })

  it('renders nothing if there are no attachments', () => {
    render(<ImageCarousel attachments={[]} />)

    // this should return 2 matching elements because
    // it matches all elements and an empty render
    // looks like this:
    // <body>
    //  <div />
    // </body>
    expect(screen.queryAllByText(/.*/)).to.have.lengthOf(2)
  })

  it('displays the first of the given attachments', async () => {
    setup()

    expect(await screen.findByAltText('name1')).to.exist
  })

  it('allows the user to see the next image', async () => {
    setup()
    fireEvent.click(nextImage)

    expect(await screen.findByAltText('name2')).to.exist
  })

  it('but disables the "next" button when on the last item', async () => {
    setup()
    fireEvent.click(nextImage)
    fireEvent.click(nextImage)

    expect(nextImage).to.have.attribute('disabled')
  })

  it('allows the user to see the previous image', async () => {
    setup()
    fireEvent.click(nextImage)
    fireEvent.click(nextImage)
    fireEvent.click(previousImage)

    expect(await screen.findByAltText('name2')).to.exist
  })

  it('but disables the "previous" button when on the last item', async () => {
    setup()

    expect(previousImage).to.have.attribute('disabled')
  })

  it('displays nothing for extensions not included in the whitelist', async () => {
    const attachments = [
      {
        name: "won't find me",
        url: 'url1.html',
      },
    ] as Array<ImageAPI>

    render(<ImageCarousel attachments={attachments} />)

    expect(() => screen.getByAltText(/won't find me/i)).to.throw(
      Error,
      /unable to find an element/i
    )
  })

  describe('video', () => {
    const queryBuilder = (name: RegExp, query?: string) => {
      switch (query) {
        case 'find':
          return screen.findByRole('button', { name: name })
        case 'get':
        default:
          return screen.getByRole('button', { name: name })
      }
    }
    const playButton = (query?: string) => {
      return queryBuilder(/play/i, query)
    }
    const pauseButton = (query?: string) => {
      return queryBuilder(/pause/i, query)
    }

    const attachments = [
      {
        name: 'movie',
        url: 'url1.mp4',
      },
    ] as Array<ImageAPI>

    const setup = () => {
      render(<ImageCarousel attachments={attachments} />)
    }

    before(() => {
      playStub = sinon.stub().returns(Promise.resolve())
      pauseStub = sinon.stub().callsFake(() => {
        // try {
        //   throw Error('in pause try')
        // } catch (e) {
        //   console.log('pause called', e)
        // }

        return Promise.resolve()
      })
      window.HTMLMediaElement.prototype.play = playStub
      window.HTMLMediaElement.prototype.pause = pauseStub
    })
    afterEach(() => {
      playStub.resetHistory()
      pauseStub.resetHistory()
    })
    after(() => {
      delete window.HTMLMediaElement.prototype.play
      delete window.HTMLMediaElement.prototype.pause
    })

    it('also displays videos', async () => {
      setup()
      // non-video media items won't display a play button
      expect(await playButton('find')).to.exist
    })

    it('allows users to play the video', () => {
      setup()
      fireEvent.click(playButton('get') as HTMLElement)

      // check that the stubbed play method on video elements was called
      expect(playStub.called).to.be.true
    })

    it('allows users to pause the video', () => {
      setup()
      // first play, to enable the pause button
      fireEvent.click(playButton('get') as HTMLElement)
      // then pause the video
      fireEvent.click(pauseButton('get') as HTMLElement)

      // and check that the pause method on the video element was called
      expect(pauseStub.called).to.be.true
    })

    it('handles autopausing with AutoPause hook', () => {
      setup()
      const autoPauseArgs = useAutoPauseStub.args[0]
      const autoPlay = autoPauseArgs[1]
      const autoPause = autoPauseArgs[2]

      // test that the hook's play handler works
      autoPlay()
      // if video is paused, it displays the play button
      expect(pauseButton('find')).to.exist

      // test that the hook's pause handler works
      autoPause()
      // if video is paused, it displays the play button
      expect(playButton('find')).to.exist
    })
  })
})
