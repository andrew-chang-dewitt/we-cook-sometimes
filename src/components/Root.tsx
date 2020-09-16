import React from 'react'

import useStateHistory from '../utils/useStateHistory'
import fetch from '../lib/data/fetch'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../lib/core/RecipeList'

import styles from './Root.module.sass'

const Root = () => {
  const { state, setState } = useStateHistory({
    recipes: {} as RecipeListType,
  })

  // FIXME: getting rate limited when the images are getting resolved
  // from their attachment cover id =>
  // instead fetch.recipes() needs modified to only return the cover id,
  // then the image will be fetched by the recipe card/preview component
  // later; maybe this can be wrapped in Lazy/Suspend too at that time.
  fetch.recipes().then((res) =>
    setState({
      recipes: RecipeList.create(res),
    })
  )

  return (
    <>
      <h1 className={styles.title}>What about this?</h1>
      <div>{JSON.stringify(state)}</div>
    </>
  )
}

export default Root
