// external libraries
import React from 'react'

// core logic
import { Choice as ChoiceType } from '../../../lib/data/questions'

// other components

// CSS-modules
import styles from './ChoiceList.module.sass'

export interface SingleAnswerHandler {
  (answer: ChoiceType): void
}

interface Props {
  choices: Array<ChoiceType>
  handler: SingleAnswerHandler
}

export default ({ choices, handler }: Props) => (
  <ul className={styles.container}>
    {choices.map((choice, index) => (
      <li key={choice.text}>
        {index !== choices.length - 1 ? (index !== 0 ? ',' : '') : ', or'}

        <button
          onClick={(e: React.FormEvent<HTMLElement>) => {
            handler(choice)
            e.preventDefault()
          }}
        >
          {choice.text}
        </button>

        {index !== choices.length - 1 ? null : '?'}
      </li>
    ))}
  </ul>
)
