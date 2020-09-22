import React from 'react'

import useStateHistory from '../utils/useStateHistory'
import fetch from '../lib/data/fetch'
// import fetch, { Tag as TagType } from '../lib/data/fetch'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../lib/core/RecipeList'

import List from './recipes/List'

// import styles from './Root.module.sass'

const publishedTagId = '5f55960c17f08e1fde18785e'

const Root = () => {
  const { state, setState } = useStateHistory({
    recipes: {} as RecipeListType,
    // tags: {} as TagType[],
  })

  // calling setState later allows for component to load while
  // waiting for promise returned by fetch.recipes() to resolve
  // with data
  // wrapping all of it in useEffect keeps it from taring an
  // infinite loop as the component is reloaded because
  // setState was called
  React.useEffect(() => {
    // Fetch Recipes from Trello API, then build Recipe List from lib
    fetch
      .recipes()
      .then((res) =>
        setState({
          ...state,
          recipes: RecipeList.create(res.unwrap()).filterByTag(publishedTagId),
        })
      )
      .catch((e) => {
        throw e
      })

    // // Fetch Tags from Trello API
    // fetch.tags().then((res) => setState({ ...state, tags: res.unwrap() }))
  }, [])

  return (
    <>
      {state.recipes.remaining ? (
        <List
          recipes={state.recipes.remaining.map(
            (recipe) => state.recipes.allByID[recipe]
          )}
        />
      ) : null}
    </>
  )
}

export default Root
