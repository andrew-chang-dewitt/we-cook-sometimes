// external libraries
import React from 'react'

// core logic
import { Question, Choice as ChoiceType } from '../../../lib/data/questions'

// other components
import LayoutContext from '../../LayoutContext'
import Choice from './Choice'
import Up from '../../icons/Up'
import Down from '../../icons/Down'

// CSS-modules
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
}: Props) => {
  const [questionCollapsed, setQuestionsCollapsed] = React.useState(false)
  const setYOffset = React.useContext(LayoutContext).setScrollYOffset

  const openQuestion = () => {
    setQuestionsCollapsed(false)
    setYOffset(270)
  }
  const closeQuestion = () => {
    setQuestionsCollapsed(true)
    setYOffset(52)
  }

  React.useEffect(() => {
    setYOffset(270)
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div
          className={`${styles.questionContainer} ${
            questionCollapsed ? styles.collapsed : ''
          }`}
        >
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
        </div>

        <div className={styles.divider}>
          <hr />

          {questionCollapsed ? (
            <button onClick={openQuestion}>
              <Down />
            </button>
          ) : (
            <button onClick={closeQuestion}>
              <Up />
            </button>
          )}
        </div>

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
    </div>
  )
}
