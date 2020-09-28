import 'mocha'
import { expect } from 'chai'
import { render, cleanup, screen } from '@testing-library/react'
import React from 'react'

import Link from './Link'

describe('component/detail/Link', () => {
  it('creates an `a` tag link using a given `href` & children', async () => {
    const href = 'destination'

    render(<Link href={href}>Child</Link>)

    expect(await screen.findByText(/child/i)).to.exist
    expect((await screen.findByText(/child/i)).getAttribute('href')).equals(
      'destination'
    )

    cleanup()
  })
})
