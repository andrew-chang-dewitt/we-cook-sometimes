import React from 'react'

// core logic
import { publishedTagId} from '../../lib/data/fetch'
import {
  Question as QuestionType,
  Choice as ChoiceType,
} from '../../lib/data/questions'
import QuestionSeries from '../../lib/core/QuestionSeries'
import {
  RecipeList as RecipeListType,
} from '../../lib/core/RecipeList'

// internal utilities
import useStateHistory from '../../utils/useStateHistory'

// other components
import Question from './questions/Question'
import List from './recipes/List'

interface Props {
  recipes: RecipeListType
  questions: Array<QuestionType>
}

export default ({ recipes, questions }: Props) => {
  const { state, setState, undo, onOldest } = useStateHistory({
    recipes: recipes.filterByTag(publishedTagId),
    questions: QuestionSeries.create(questions),
  })
  const answerQuestion = (answer: ChoiceType) => {
    setState({
      recipes: state.recipes.eliminateByTags(answer.tagsEliminated),
      questions: state.questions.next(),
    })
  }

  return (
    <>
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
    </>
  )
}
