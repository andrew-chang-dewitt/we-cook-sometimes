// testing tools
import 'mocha'
import { expect } from 'chai'
import {
  renderHook,
  act,
  cleanup as cleanupHooks,
} from '@testing-library/react-hooks'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

// dependencies
import React from 'react'
import { useLocation, useHistory, MemoryRouter } from 'react-router'
import { Location } from 'history'

// item under test
import useQueryParam from './useQueryParam'

describe('utils/useQueryParam', () => {
  function setup<T = string>(param: string, defaultValue: T, search: string) {
    const wrapper: React.FunctionComponent = ({ children }) => (
      <MemoryRouter initialEntries={[{ search }]}>{children}</MemoryRouter>
    )

    return renderHook(() => useQueryParam<T>(param, defaultValue), { wrapper })
  }

  afterEach(() => {
    cleanupHooks()
  })

  it('returns the value of the requested URL search parameter', () => {
    const { result } = setup('test', '', '?test=value')
    const [value] = result.current

    expect(value).to.equal('value')
  })

  it('can store numbers as query parameters', () => {
    const { result } = setup<number>('test', 1, '')

    expect(result.current[0]).to.equal(1)
  })

  it('can store JSON serializable objects as query parameters', () => {
    interface Test {
      num?: number
      str?: string
      arr?: Array<string>
      nested?: {
        num?: number
      }
    }
    const { result } = setup<Test>('test', { arr: ['a'] }, '')

    expect(result.current[0]).to.deep.equal({ arr: ['a'] })
  })

  describe('setter()', () => {
    it('returns a setter to update the value', () => {
      const { result } = setup('test', '', '?test=value')

      act(() => {
        result.current[1]('new value')
      })

      expect(result.current[0]).to.equal('new value')
    })

    it('can update non-string type values', () => {
      interface Test {
        num?: number
        str?: string
        arr?: Array<string>
        nested?: {
          num?: number
        }
      }
      const { result } = setup<Test>('test', { arr: ['a'] }, '')

      act(() => {
        result.current[1]({ num: 1 })
      })

      expect(result.current[0]).to.deep.equal({ num: 1 })
    })
  })

  describe('location behavior', () => {
    let queryInput: HTMLInputElement
    let goBackButton: HTMLButtonElement
    let goForwardButton: HTMLButtonElement

    const setup = (
      param: string,
      defaultValue: string,
      history: Array<Location<{}>>
    ) => {
      const Wrapper: React.FunctionComponent = ({ children }) => (
        <MemoryRouter initialEntries={history}>{children}</MemoryRouter>
      )
      const TestComponent = () => {
        const location = useLocation()
        const history = useHistory()
        const [value, setValue] = useQueryParam<string>(param, defaultValue)

        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value)
        }

        return (
          <>
            <input title="Query" value={value} onChange={onChange} />
            <button onClick={history.goBack}>Back</button>
            <button onClick={history.goForward}>Forward</button>
            <p>Current value: {value}</p>
            <p>Current location: {location.search}</p>
          </>
        )
      }

      render(
        <Wrapper>
          <TestComponent />
        </Wrapper>
      )

      queryInput = screen.getByRole('textbox', {
        name: /query/i,
      }) as HTMLInputElement
      goBackButton = screen.getByRole('button', {
        name: /back/i,
      }) as HTMLButtonElement
      goForwardButton = screen.getByRole('button', {
        name: /forward/i,
      }) as HTMLButtonElement
    }

    const inputEvent = (element: HTMLInputElement, newValue: string) => {
      act(() => {
        fireEvent.change(element, { target: { value: newValue } })
      })
    }

    afterEach(() => {
      cleanup()
    })

    it('updates the location when it updates the value', async () => {
      setup('test', '', [{ search: '?test=initial' } as Location<{}>])

      inputEvent(queryInput, 'new value')

      expect(await screen.findByText(/current location.*new\+value/i)).to.exist
    })

    it('updates the value when the user clicks the back button', async () => {
      setup('test', '', [
        { search: '?test=went+back' } as Location<{}>,
        { search: '?test=started+here' } as Location<{}>,
      ])

      fireEvent.click(goBackButton)

      expect(await screen.findByText(/current value.*went back/i)).to.exist
    })

    it('updates the location when the user clicks the back button', async () => {
      setup('test', '', [
        { search: '?test=went+back' } as Location<{}>,
        { search: '?test=started+here' } as Location<{}>,
      ])

      fireEvent.click(goBackButton)

      expect(await screen.findByText(/current location.*went\+back/i)).to.exist
    })

    it('updates the value when the user clicks the forward button', async () => {
      setup('test', '', [
        { search: '?test=started+here' } as Location<{}>,
        { search: '?test=went+forward' } as Location<{}>,
      ])

      fireEvent.click(goForwardButton)

      expect(await screen.findByText(/current value.*went forward/i)).to.exist
    })

    it('updates the location when the user clicks the forward button', async () => {
      setup('test', '', [
        { search: '?test=started+here' } as Location<{}>,
        { search: '?test=went+forward' } as Location<{}>,
      ])

      fireEvent.click(goForwardButton)

      expect(await screen.findByText(/current location.*went\+forward/i)).to
        .exist
    })
  })
})
