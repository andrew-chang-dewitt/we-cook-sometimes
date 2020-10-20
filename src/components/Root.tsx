// external libs
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// internal utilities
import shuffle from '../utils/FisherYatesShuffle'

// core logic
import fetch from '../lib/data/fetch'
import questions from '../lib/data/questions'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../lib/core/RecipeList'

// other components
import LookupContext, {
  LookupTables,
  RecipeLookup,
  RecipeByID,
} from '../utils/LookupContext'
import Home from './home/Home'
import AllRecipes from './AllRecipes'
import RecipePage from './RecipePage'
import NavMenu from './header/NavMenu'

// import styles from './Root.module.sass'

const buildByUrlTable = (recipeList: RecipeListType): RecipeLookup => {
  const byUrl: RecipeLookup = {}

  Object.values(recipeList.allByID).forEach(
    (recipe) => (byUrl[recipe.shortLink] = recipe.id)
  )

  return byUrl
}

export default () => {
  const [recipes, setRecipes] = React.useState({
    data: {} as RecipeListType,
    loaded: false,
  })

  const [lookupTables, setLookupTables] = React.useState<LookupTables>({
    recipeByUrl: {} as RecipeLookup,
    recipeByID: {} as RecipeByID,
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

        setLookupTables({
          recipeByUrl: buildByUrlTable(recipeList),
          recipeByID: recipeList.allByID,
        })

        setRecipes({
          data: recipeList,
          loaded: true,
        })
      })
      .catch((e) => {
        // FIXME: better error handling
        throw e
      })
  }, [])

  return (
    <LookupContext.Provider value={lookupTables}>
      <Router>
        <Switch>
          <Route exact path="/">
            {recipes.loaded ? (
              <Home recipes={recipes.data} questions={questions} />
            ) : (
              'loading...'
            )}
          </Route>

          <Route path="/all-recipes">
            {recipes.loaded ? (
              <AllRecipes recipes={recipes.data} />
            ) : (
              'loading...'
            )}
          </Route>

          <Route path="/menu">{<NavMenu />}</Route>

          <Route path="/recipe/:recipeID">
            {recipes.loaded ? <RecipePage /> : 'loading...'}
          </Route>
        </Switch>
      </Router>
    </LookupContext.Provider>
  )
}
