import React from 'react'

// core logic
import { publishedTagId } from '../../lib/data/fetch'
import {
  Question as QuestionType,
  Choice as ChoiceType,
  Inclusionary,
  isExclusionary,
} from '../../lib/data/questions'
import QuestionSeries from '../../lib/core/QuestionSeries'
import { RecipeList as RecipeListType } from '../../lib/core/RecipeList'

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
    const filterByTags = (
      list: RecipeListType,
      answer: Inclusionary
    ): RecipeListType => {
      answer.tagsRequired.forEach((tag: string) => {
        list = list.filterByTag(tag)
      })

      return list
    }

    isExclusionary(answer)
      ? setState({
          recipes: state.recipes.eliminateByTags(answer.tagsEliminated),
          questions: state.questions.next(),
        })
      : setState({
          recipes: filterByTags(state.recipes, answer),
          questions: state.questions.next(),
        })
  }

  const resetQuestions = (): void => {
    while (!onOldest) {
      undo()
    }
  }

  return (
    <>
      <Question
        question={state.questions.current}
        submitAnswer={answerQuestion}
        previous={undo}
        previousExists={!onOldest}
        reset={resetQuestions}
      />
      <List
        recipes={state.recipes.remaining.map(
          (recipe) => state.recipes.allByID[recipe]
        )}
      />
    </>
  )
}
