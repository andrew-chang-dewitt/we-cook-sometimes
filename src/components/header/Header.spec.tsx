// testing tools
import 'mocha'
import { expect } from 'chai'
import { render, screen, cleanup } from '@testing-library/react'

// dependencies
import React from 'react'
import { MemoryRouter } from 'react-router'

// component under test
import Header from './Header'

describe('component/Header', () => {
  it('renders a button that links to the menu', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    expect(screen.findByRole('button', { name: /open nav/i })).to.exist

    cleanup()
  })
})
