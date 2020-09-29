// external libraries
import React from 'react'
import { Link } from 'react-router-dom'

// internal utilities
import { Recipe } from '../../lib/data/fetch'

// other components
import TagsList from '../tags/List'
import ImageLoader from '../images/ImageLoader'
import DetailLoader from '../detail/DetailLoader'
import More from '../icons/More'
import Less from '../icons/Close'

// CSS-modules
import styles from './Card.module.sass'

interface Props {
  recipe: Recipe
  detailsOpen: boolean
}

export default ({ recipe, detailsOpen }: Props) => {
  const {
    id,
    name,
    tags,
    // idList,
    idAttachmentCover,
  } = recipe

  return (
    <li
      className={
        detailsOpen ? `${styles.card} ${styles.details}` : `${styles.card}`
      }
    >
      <Link to={detailsOpen ? '' : `?open=${id}`}>
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

        {/* Open details using a Router Switch maybe? */}
        {/* can definitely do it off a prop though */}
        {!detailsOpen ? <h3 className={styles.title}>{name}</h3> : null}
      </Link>
      {detailsOpen ? <DetailLoader recipe={recipe} /> : null}
    </li>
  )
}
