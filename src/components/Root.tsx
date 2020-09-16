import React from 'react'

import useStateHistory from '../utils/useStateHistory'

import styles from './Root.module.sass'

interface Counter {
  value: number
  increase: Increase
}

interface Increase {
  (): Counter
}

const increasable = (state: { value: number }): { increase: Increase } => ({
  increase: () =>
    Count({
      ...state,
      value: state.value + 1,
    }),
})

const Count = (state: { value: number }): Counter =>
  Object.assign(state, increasable(state))

const Root = () => {
  const { state: count, setState: setCount, undo } = useStateHistory(
    Count({ value: 0 })
  )

  return (
    <>
      <h1 className={styles.title}>What about this?</h1>
      <div>This is count: {count.value}</div>
      <button onClick={() => setCount(count.increase())}>+1</button>
      <button onClick={() => undo()}>undo</button>
    </>
  )
}

export default Root
