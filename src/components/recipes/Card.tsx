import React from 'react'

import { Recipe } from '../../lib/data/fetch'
import Tag from '../Tag'
import Image from '../Image'

interface Props {
  recipe: Recipe
}

export default ({ recipe }: Props) => {
  const {
    id,
    name,
    tags,
    // idList,
    idAttachmentCover,
  } = recipe

  return (
    <>
      <h3>{name}</h3>
      <ul>
        {tags.map((tag) => (
          <Tag tag={tag} />
        ))}
      </ul>
      {idAttachmentCover !== null ? (
        <Image cardId={id} attachmentId={idAttachmentCover} />
      ) : null}
    </>
  )
}
