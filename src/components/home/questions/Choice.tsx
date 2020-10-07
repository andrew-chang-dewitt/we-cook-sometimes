import React from 'react'

import { Choice } from '../../../lib/data/questions'

import styles from './Choice.module.sass'

interface Props {
  data: Choice
  handler: () => void
}

export default ({ data, handler }: Props) => (
  <li className={styles.container}>
    <button onClick={handler}>{data.text}</button>
  </li>
)
