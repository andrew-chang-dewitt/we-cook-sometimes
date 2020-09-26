import 'mocha'
import { expect, use } from 'chai'
import { default as chaiDom } from 'chai-dom'

use(chaiDom)

import { render, screen, fireEvent } from '@testing-library/react'

import React from 'react'

import { ImageAPI } from '../../lib/data/fetch'
import ImageCarousel from './ImageCarousel'

describe('src/component/detail/ImageCarousel', () => {
  let nextImage: HTMLElement
  let previousImage: HTMLElement

  const attachments = [
    {
      name: 'name1',
      url: 'url1',
    },
    {
      name: 'name2',
      url: 'url2',
    },
    {
      name: 'name3',
      url: 'url3',
    },
  ] as Array<ImageAPI>

  const setup = (): void => {
    console.log(attachments)
    render(<ImageCarousel attachments={attachments} />)
    nextImage = screen.getByRole('button', { name: /next image/i })
    previousImage = screen.getByRole('button', { name: /previous image/i })
  }

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
})
