// testing tools
import 'mocha'
import { expect } from 'chai'
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react'

// dependencies
import React from 'react'

// component under test
import SearchBar from './SearchBar'

describe('component/SearchBar', () => {
  const inputEvent = (element: HTMLInputElement, newValue: string) => {
    act(() => {
      fireEvent.change(element, { target: { value: newValue } })
    })
  }

  afterEach(() => {
    cleanup()
  })

  it('renders a given value as the input value', () => {
    render(<SearchBar value="a value" changeHandler={() => {}} />)

    expect(
      screen.getByRole('textbox', { name: /search/i }).getAttribute('value')
    ).to.equal('a value')
  })

  it('delegates updates to the input value via changeHandler prop', () => {
    let value = 'initial value'
    const delegatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value
    }

    render(<SearchBar value={value} changeHandler={delegatedChange} />)

    inputEvent(
      screen.getByRole('textbox', { name: /search/i }) as HTMLInputElement,
      'new value'
    )

    expect(value).to.equal('new value')
  })

  it('delegates the submit button handler via submitHandler prop', () => {
    let submitted = false
    const delegatedSubmit = (e: React.FormEvent<HTMLElement>) => {
      submitted = true
      e.preventDefault()
    }

    render(
      <SearchBar
        value="doesn't matter"
        changeHandler={() => {}}
        submitHandler={delegatedSubmit}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    expect(submitted).to.be.true
  })
})
