import 'mocha'
import { expect } from 'chai'
import { renderHook, act } from '@testing-library/react-hooks'

import useStateHistory from './useStateHistory'

describe('utils/useStateHistory', () => {
  it('returns a state object equal to the provided initial value', () => {
    const { result } = renderHook(() => useStateHistory('initial value'))

    expect(result.current.state).to.equal('initial value')
  })

  describe('setState()', () => {
    it('setting a new state value updates the current value', () => {
      const { result } = renderHook(() => useStateHistory('initial value'))

      act(() => {
        result.current.setState('new value')
      })

      expect(result.current.state).to.equal('new value')
    })
  })

  describe('undo()', () => {
    it("returns the state to it's previous value", () => {
      const { result } = renderHook(() => useStateHistory('initial value'))

      act(() => {
        result.current.setState('new value')
      })
      act(() => {
        result.current.undo()
      })

      expect(result.current.state).to.equal('initial value')
    })

    it("can't undo if there is no previous value", () => {
      const { result } = renderHook(() => useStateHistory('initial value'))

      expect(() => result.current.undo()).to.throw(
        RangeError,
        /.*unable to undo.*already at the oldest/i
      )
    })

    it('knows if it is already on the oldest value', () => {
      const { result } = renderHook(() => useStateHistory('initial value'))

      expect(result.current.onOldest).to.be.true
    })
  })
})
