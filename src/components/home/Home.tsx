// external dependencies
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
import Layout from '../Layout'
import Question from './questions/Question'
import List from './recipes/List'

interface Props {
  recipes: RecipeListType
  questions: Array<QuestionType>
}

const filterByTags = (
  list: RecipeListType,
  answer: Inclusionary
): RecipeListType => {
  answer.tagsRequired.forEach((tag: string) => {
    list = list.filterByTag(tag)
  })

  return list
}

export default ({ recipes, questions }: Props) => {
  const { state, setState, undo, onOldest } = useStateHistory({
    recipes: recipes.filterByTag(publishedTagId),
    questions: QuestionSeries.create(questions),
    answers: [] as Array<string>,
  })

  const singleAnswer = (answer: ChoiceType): void => {
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

  const multiAnswer = (answers: Array<ChoiceType>): void => {
    const newAnswers = [...state.answers]
    let newList = state.recipes

    answers.forEach((answer) => {
      newAnswers.push(answer.text)

      isExclusionary(answer)
        ? (newList = newList.eliminateByTags(answer.tagsEliminated))
        : (newList = filterByTags(newList, answer))
    })

    setState({
      recipes: newList,
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
    <Layout>
      <Question
        question={state.questions.current}
        submittedAnswers={state.answers}
        submitHandlers={[singleAnswer, multiAnswer]}
        previous={undo}
        previousExists={!onOldest}
        reset={resetQuestions}
      />
      <List
        recipes={state.recipes.remaining.map(
          (recipe) => state.recipes.allByID[recipe]
        )}
      />
    </Layout>
  )
}
