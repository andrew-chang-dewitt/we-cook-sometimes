// external libs
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// internal utilities
import shuffle from '../utils/FisherYatesShuffle'
import { mergeResults } from '../utils/Result'

// core logic
import fetch from '../lib/data/fetch'
import { Tag } from '../lib/data/schema'
import questions from '../lib/data/questions'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../lib/core/RecipeList'

// other components
import LookupContext, {
  LookupTables,
  RecipeLookup,
  TagByID,
} from '../utils/LookupContext'
import Home from './home/Home'
import AllRecipes from './AllRecipes'
import RecipePage from './RecipePage'
import NavMenu from './header/NavMenu'

// import styles from './Root.module.sass'

const buildTagsTable = (tags: Array<Tag>): TagByID =>
  tags.reduce((hashed: TagByID, current: Tag) => {
    hashed[current.id] = current

    return hashed
  }, {})

const buildByUrlTable = (recipeList: RecipeListType): RecipeLookup => {
  const byUrl: RecipeLookup = {}

  Object.values(recipeList.allByID).forEach(
    (recipe) => (byUrl[recipe.shortLink] = recipe.id)
  )

  return byUrl
}

export default () => {
  // initialize state w/ empty empty objects, will be populated on data fetch
  const [recipes, setRecipes] = React.useState({
    data: {} as RecipeListType,
    loaded: false,
  })
  const [lookupTables, setLookupTables] = React.useState<LookupTables>({
    recipeByUrl: {},
    recipeByID: {},
    tagsByID: {},
  })

  // calling setState later allows for component to load while
  // waiting for promise returned by fetch.recipes() to resolve
  // with data
  // wrapping all of it in useEffect keeps it from starting an
  // infinite loop as the component is reloaded because
  // setState was called
  React.useEffect(() => {
    Promise.all([fetch.tags(), fetch.recipes()])
      .then(([tagsRes, recipesRes]) =>
        mergeResults(tagsRes, recipesRes, (tags, recipes) => ({
          tags,
          recipes,
        }))
      )
      .then((res) => {
        const unwrapped = res.unwrap()
        // shuffle the list each time it's generated to change order displayed
        const recipeList = RecipeList.create(
          shuffle(unwrapped.recipes, Math.random)
        )
        const lookupTables = {
          recipeByUrl: buildByUrlTable(recipeList),
          recipeByID: recipeList.allByID,
          tagsByID: buildTagsTable(unwrapped.tags),
        }

        setLookupTables(lookupTables)
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
