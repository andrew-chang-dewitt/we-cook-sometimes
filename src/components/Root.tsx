// external libs
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// internal utilities
import useStateHistory from '../utils/useStateHistory'
import shuffle from '../utils/FisherYatesShuffle'

// core logic
import fetch from '../lib/data/fetch'
// import fetch, { Tag as TagType } from '../lib/data/fetch'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../lib/core/RecipeList'

// internal utilities
import LookupContext, {
  LookupTables,
  RecipeLookup,
} from '../utils/LookupContext'

// other components
import List from './recipes/List'
import RecipePage from './recipes/RecipePage'

// import styles from './Root.module.sass'

export const publishedTagId = '5f55960c17f08e1fde18785e'

const Root = () => {
  const [lookupTables, setLookupTables] = React.useState<LookupTables>({
    recipeByUrl: {},
    recipeByID: {},
  })
  const { state, setState } = useStateHistory({
    recipes: { data: {} as RecipeListType, loaded: false },
    // tags: {} as TagType[],
  })

  // calling setState later allows for component to load while
  // waiting for promise returned by fetch.recipes() to resolve
  // with data
  // wrapping all of it in useEffect keeps it from staring an
  // infinite loop as the component is reloaded because
  // setState was called
  React.useEffect(() => {
    // Fetch Recipes from Trello API, then build Recipe List from lib
    fetch
      .recipes()
      .then((res) => {
        const recipeList = RecipeList.create(shuffle(res.unwrap(), Math.random))

        const byUrl: RecipeLookup = {}

        Object.values(recipeList.allByID).forEach(
          (recipe) => (byUrl[recipe.url] = recipe.id)
        )
        setLookupTables({
          recipeByUrl: byUrl,
          recipeByID: recipeList.allByID,
        })

        setState({
          ...state,
          recipes: {
            loaded: true,
            data: recipeList.filterByTag(publishedTagId),
          },
        })
      })
      .catch((e) => {
        // FIXME: better error handling
        throw e
      })

    // // Fetch Tags from Trello API
    // fetch.tags().then((res) => setState({ ...state, tags: res.unwrap() }))
  }, [])

  return (
    <LookupContext.Provider value={lookupTables}>
      <Router>
        <Switch>
          <Route exact path="/">
            {state.recipes.loaded ? (
              <List
                recipes={state.recipes.data.remaining.map(
                  (recipe) => state.recipes.data.allByID[recipe]
                )}
              />
            ) : (
              'loading...'
            )}
          </Route>

          <Route path="/recipe/:recipeID">
            {state.recipes.loaded ? <RecipePage /> : null}
          </Route>
        </Switch>
      </Router>
    </LookupContext.Provider>
  )
}

export default Root
