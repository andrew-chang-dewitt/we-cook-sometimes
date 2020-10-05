import React from 'react'

import { Choice } from '../../../lib/data/questions'

interface Props {
  data: Choice
  handler: () => void
}

export default ({ data, handler }: Props) => (
  <li>
    <button onClick={handler}>{data.text}</button>
  </li>
)
