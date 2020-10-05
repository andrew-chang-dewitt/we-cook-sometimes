import React from 'react'

import { Question, Choice as ChoiceType } from '../../../lib/data/questions'

import Choice from './Choice'

interface Props {
  question: Question
  submitAnswer: (answer: ChoiceType) => void
}

export default ({ question, submitAnswer }: Props) => (
  <>
    <h2>{question.text}</h2>
    <ul>
      {question.choices.map((choice) => (
        <Choice
          key={choice.text}
          data={choice}
          handler={() => submitAnswer(choice)}
        />
      ))}
    </ul>
  </>
)
