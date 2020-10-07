import React from 'react'

import { Question, Choice as ChoiceType } from '../../../lib/data/questions'

import Choice from './Choice'

import styles from './Question.module.sass'

interface Props {
  question: Question | null
  submittedAnswers: Array<string>
  submitAnswer: (answer: ChoiceType) => void
  previous: () => void
  previousExists: boolean
  reset: () => void
}

export default ({
  question,
  submittedAnswers,
  submitAnswer,
  previous,
  previousExists,
  reset,
}: Props) => (
  <div className={styles.container}>
    {question ? (
      <>
        <h2 className={styles.question}>{question.text}</h2>
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
    ) : (
      <h2 className={styles.question}>...no more questions</h2>
    )}
    <div className={styles.questionNavigation}>
      {previousExists ? (
        <>
          <button onClick={previous}>Previous question</button>
          <button onClick={reset}>Start over</button>
        </>
      ) : null}
    </div>
    <hr />
    {submittedAnswers.length > 0 ? (
      <div className={styles.submittedAnswers}>
        <p>Filtering by:</p>
        <ul>
          {submittedAnswers.map((answer) => (
            <li key={answer}>{answer}</li>
          ))}
        </ul>
      </div>
    ) : null}
  </div>
)
