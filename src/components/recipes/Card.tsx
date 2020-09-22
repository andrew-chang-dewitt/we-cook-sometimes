import React from 'react'

import { Recipe } from '../../lib/data/fetch'
import Tag from '../Tag'
import Image from '../Image'

import styles from './Card.module.sass'

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
    <li className={styles.card}>
      <div className={styles.imgContainer}>
        <div className={styles.info}>
          <ul className={styles.tagsList}>
            {tags.map((tag) => (
              <Tag tag={tag} key={tag.id} />
            ))}
          </ul>
        </div>
        {idAttachmentCover !== null ? (
          <Image
            cardId={id}
            attachmentId={idAttachmentCover}
            size={{ width: 320 }}
          />
        ) : null}
      </div>
      <h3>{name}</h3>
    </li>
  )
}
