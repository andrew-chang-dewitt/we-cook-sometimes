// external libraries
import React from 'react'

// core logic
import {
  isSingleChoiceQuestion,
  Question,
  Choice as ChoiceType,
} from '../../../lib/data/questions'

// other components
import LayoutContext from '../../LayoutContext'
import SingleChoiceList from './SingleChoiceList'
import MultiChoiceList from './MultiChoiceList'
import Up from '../../icons/Up'
import Down from '../../icons/Down'

// CSS-modules
import styles from './Question.module.sass'

interface SingleAnswerHandler {
  (answer: ChoiceType): void
}
interface MultiAnswerHandler {
  (answers: Array<ChoiceType>): void
}

interface Props {
  question: Question | null
  submittedAnswers: Array<string>
  submitHandlers: [SingleAnswerHandler, MultiAnswerHandler]
  previous: () => void
  previousExists: boolean
  reset: () => void
}

export default ({
  question,
  submittedAnswers,
  submitHandlers,
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
          className={styles.questionContainer}
          style={questionCollapsed ? { height: 0 } : {}}
        >
          {question ? (
            <>
              <h2
                className={styles.question}
                style={questionCollapsed ? { visibility: 'hidden' } : {}}
              >
                {question.text}
              </h2>

              <div style={questionCollapsed ? { visibility: 'hidden' } : {}}>
                {isSingleChoiceQuestion(question) ? (
                  <SingleChoiceList
                    choices={question.choices}
                    handler={submitHandlers[0]}
                  />
                ) : (
                  <MultiChoiceList
                    choices={question.choices}
                    handler={submitHandlers[1]}
                  />
                )}
              </div>
            </>
          ) : (
            <h2
              className={styles.question}
              style={questionCollapsed ? { visibility: 'hidden' } : {}}
            >
              ...no more questions
            </h2>
          )}

          <div
            className={styles.questionNavigation}
            style={questionCollapsed ? { visibility: 'hidden' } : {}}
          >
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
            <button aria-label="Expand question" onClick={openQuestion}>
              <Down />
            </button>
          ) : (
            <button aria-label="Collapse question" onClick={closeQuestion}>
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
