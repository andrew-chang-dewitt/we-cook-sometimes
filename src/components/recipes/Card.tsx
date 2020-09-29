import React from 'react'

import { Recipe } from '../../lib/data/fetch'

import TagsList from '../tags/List'
import ImageLoader from '../images/ImageLoader'
import DetailLoader from '../detail/DetailLoader'
import More from '../icons/More'
import Less from '../icons/Close'

import styles from './Card.module.sass'

interface Props {
  recipe: Recipe
}

export default ({ recipe }: Props) => {
  const [detailsOpen, setDetailsOpen] = React.useState(false)

  const {
    id,
    name,
    tags,
    // idList,
    idAttachmentCover,
  } = recipe

  const toggleDetails = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault()
    setDetailsOpen(!detailsOpen)
  }

  return (
    <li
      className={
        detailsOpen ? `${styles.card} ${styles.details}` : `${styles.card}`
      }
    >
      <a href={`/recipe/${id}`} onClick={toggleDetails}>
        <div className={styles.imgContainer}>
          <div className={styles.info}>
            {!detailsOpen ? (
              <>
                <div>
                  <TagsList tags={tags.filter((tag) => tag.color !== null)} />
                </div>
                <More />
              </>
            ) : (
              <>
                <div></div>
                <div>
                  <Less />
                </div>
              </>
            )}
          </div>
          {idAttachmentCover !== null ? (
            <ImageLoader
              cardId={id}
              attachmentId={idAttachmentCover}
              size={{ width: 320 }}
            />
          ) : null}
        </div>
        {!detailsOpen ? <h3 className={styles.title}>{name}</h3> : null}
      </a>
      {detailsOpen ? <DetailLoader recipe={recipe} /> : null}
    </li>
  )
}
