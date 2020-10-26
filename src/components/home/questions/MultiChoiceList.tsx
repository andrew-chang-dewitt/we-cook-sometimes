// external libraries
import React from 'react'

// core logic
import { Choice as ChoiceType } from '../../../lib/data/questions'

// other components

// CSS-modules
import styles from './ChoiceList.module.sass'

interface AnswerData {
  answer: ChoiceType
  selected: boolean
}

interface Answers {
  [index: string]: AnswerData
}

interface MultiAnswerHandler {
  (answers: Array<ChoiceType>): void
}

interface Props {
  choices: Array<ChoiceType>
  handler: MultiAnswerHandler
}

export default ({ choices, handler }: Props) => {
  const initialAnswers: Answers = {}
  choices.forEach((choice) => {
    initialAnswers[choice.text] = {
      answer: choice,
      selected: false,
    }
  })
  const [answers, setAnswers] = React.useState<Answers>(initialAnswers)

  const handleSelect = (choice: ChoiceType): void => {
    const newAnswers = { ...answers }
    newAnswers[choice.text] = {
      ...newAnswers[choice.text],
      selected: !newAnswers[choice.text].selected,
    }
    setAnswers(newAnswers)
  }

  const submitAnswers = (e: React.FormEvent<HTMLElement>): void => {
    const selected = Object.values(answers).reduce((accumulator, answer) => {
      answer.selected ? accumulator.push(answer.answer) : null

      return accumulator
    }, [] as Array<ChoiceType>)

    handler(selected)
    setAnswers({})
    e.preventDefault()
  }

  return (
    <form onSubmit={submitAnswers}>
      <ul className={`${styles.container} ${styles.multi}`}>
        {choices.map((choice, index) => (
          <li key={choice.text}>
            {index !== choices.length - 1 ? (index !== 0 ? ',' : '') : ', and'}

            <button
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                handleSelect(choice)
                e.preventDefault()
              }}
              className={answers[choice.text].selected ? styles.selected : ''}
            >
              {choice.text}
            </button>

            {index !== choices.length - 1 ? null : (
              <>
                ? <button type="submit">Submit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </form>
  )
}
