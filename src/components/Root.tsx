// external libs
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// internal utilities
import shuffle from '../utils/FisherYatesShuffle'

// core logic
import fetch, { Recipe } from '../lib/data/fetch'
import questions from '../lib/data/questions'

// other components
import Header from './header/Header'
import Home from './home/Home'
import RecipePage from './RecipePage'

// import styles from './Root.module.sass'

const Root = () => {
  const [recipes, setRecipes] = React.useState({
    data: [] as Array<Recipe>,
    loaded: false,
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
        const recipeList = shuffle(res.unwrap(), Math.random)

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
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          {recipes.loaded ? (
            <Home recipes={recipes.data} questions={questions} />
          ) : (
            'loading...'
          )}
        </Route>

        <Route path="/recipe/:recipeID">
          {recipes.loaded ? <RecipePage /> : 'loading...'}
        </Route>
      </Switch>
    </Router>
  )
}

export default Root
