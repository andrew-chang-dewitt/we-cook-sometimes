import { useState } from 'react'

type State<T> = {
  readonly [P in keyof T]: T[P]
}

interface Store<T> {
  readonly state: T
  setState: (newValue: T) => void
  undo: () => void
}

export default function <T>(initial: State<T>): Store<T> {
  const emptyHistory: Array<State<T>> = []
  const [history, setHistory] = useState(emptyHistory)
  const [state, setState] = useState(initial)

  const saveHistory = (state: State<T>): void => {
    setHistory([...history, state])
  }

  return {
    state,

    setState: (newValue: State<T>) => {
      saveHistory(state)
      setState(newValue)
    },

    undo: () => {
      const previous = history.pop()
      setHistory(history)

      if (previous) setState(previous)
      else
        throw RangeError(
          'Unable to undo to a previous state, already at the oldest change.'
        )
    },
  }
}
