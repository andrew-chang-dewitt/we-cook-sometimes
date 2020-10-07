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
    answers: [] as Array<string>,
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

    const newAnswers = [...state.answers]
    newAnswers.push(answer.text)

    isExclusionary(answer)
      ? setState({
          recipes: state.recipes.eliminateByTags(answer.tagsEliminated),
          questions: state.questions.next(),
          answers: newAnswers,
        })
      : setState({
          recipes: filterByTags(state.recipes, answer),
          questions: state.questions.next(),
          answers: newAnswers,
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
        submittedAnswers={state.answers}
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
