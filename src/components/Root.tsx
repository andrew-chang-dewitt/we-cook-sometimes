import React from 'react'

import useStateHistory from '../utils/useStateHistory'
import fetch from '../lib/data/fetch'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../lib/core/RecipeList'

import styles from './Root.module.sass'

const publishedTagId = '5f55960c17f08e1fde18785e'

const Root = () => {
  const { state, setState } = useStateHistory({
    recipes: {} as RecipeListType,
  })

  // calling setState later allows for component to load while
  // waiting for promise returned by fetch.recipes() to resolve
  // with data
  // wrapping all of it in useEffect keeps it from taring an
  // infinite loop as the component is reloaded because
  // setState was called
  React.useEffect(() => {
    fetch
      .recipes()
      .then((res) =>
        setState({
          recipes: RecipeList.create(res.unwrap()).filterByTag(publishedTagId),
        })
      )
      .catch((e) => {
        throw e
      })
  }, [])

  return (
    <>
      <h1 className={styles.title}>What about this?</h1>
      <div>{JSON.stringify(state.recipes.remaining)}</div>
    </>
  )
}

export default Root
