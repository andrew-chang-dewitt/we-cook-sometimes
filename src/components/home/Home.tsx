import React from 'react'

// core logic
import { publishedTagId, Recipe } from '../../lib/data/fetch'
import {
  Question as QuestionType,
  Choice as ChoiceType,
} from '../../lib/data/questions'
import QuestionSeries from '../../lib/core/QuestionSeries'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../../lib/core/RecipeList'

// internal utilities
import useStateHistory from '../../utils/useStateHistory'
import LookupContext, { RecipeLookup } from '../../utils/LookupContext'

// other components
import Question from './questions/Question'
import List from './recipes/List'

interface Props {
  recipes: Array<Recipe>
  questions: Array<QuestionType>
}

const buildByUrlTable = (recipeList: RecipeListType): RecipeLookup => {
  const byUrl: RecipeLookup = {}

  Object.values(recipeList.allByID).forEach(
    (recipe) => (byUrl[recipe.shortLink] = recipe.id)
  )

  return byUrl
}

export default ({ recipes, questions }: Props) => {
  const { state, setState, undo, onOldest } = useStateHistory({
    recipes: RecipeList.create(recipes).filterByTag(publishedTagId),
    questions: QuestionSeries.create(questions),
  })
  const lookupTables = {
    recipeByUrl: buildByUrlTable(state.recipes),
    recipeByID: state.recipes.allByID,
  }

  const answerQuestion = (answer: ChoiceType) => {
    setState({
      recipes: state.recipes.eliminateByTags(answer.tagsEliminated),
      questions: state.questions.next(),
    })
  }

  return (
    <LookupContext.Provider value={lookupTables}>
      {state.questions.current ? (
        <Question
          question={state.questions.current}
          submitAnswer={answerQuestion}
        />
      ) : (
        <p>...no more questions</p>
      )}
      {onOldest ? null : <button onClick={undo}>Previous Question</button>}
      <List
        recipes={state.recipes.remaining.map(
          (recipe) => state.recipes.allByID[recipe]
        )}
      />
    </LookupContext.Provider>
  )
}
