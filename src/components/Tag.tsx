import React from 'react'

import { Tag } from '../lib/data/fetch'

interface Props {
  tag: Tag
}

export default ({ tag }: Props) => {
  const {
    // id,
    name,
    // color,
  } = tag

  return (
    <>
      <p>{name}</p>
    </>
  )
}
