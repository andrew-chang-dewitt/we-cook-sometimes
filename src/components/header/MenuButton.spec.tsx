// testing tools
import 'mocha'
import { expect } from 'chai'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

// dependencies
import React from 'react'
import { useLocation, MemoryRouter } from 'react-router'

// component under test
import MenuButton from './MenuButton'

describe('component/header/MenuButton', () => {
  const setup = (initialEntries: Array<string> = ['/']) => {
    const TestComponent = () => {
      const location = useLocation()

      return (
        <>
          <MenuButton />
          <p>Current location: {location.pathname}</p>
        </>
      )
    }

    render(
      <MemoryRouter initialEntries={initialEntries}>
        <TestComponent />
      </MemoryRouter>
    )
  }

  afterEach(() => {
    cleanup()
  })

  it('opens the menu, if not open already', async () => {
    setup(['/'])

    fireEvent.click(screen.getByRole('button', { name: /open nav/i }))

    expect(await screen.findByText(/current location.*\/menu/i)).to.exist
  })

  it('closes the menu by going to the previous location, if already open', async () => {
    // initialize on menu, previous location was root
    setup(['/menu', '/'])

    fireEvent.click(screen.getByRole('button', { name: /close nav/i }))

    expect(await screen.findByText(/current location.*\//i)).to.exist
  })
})
