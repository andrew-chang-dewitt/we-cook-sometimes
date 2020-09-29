// external libraries
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

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
}

const useQueryParams = () => new URLSearchParams(useLocation().search)

export default ({ recipe }: Props) => {
  const {
    id,
    name,
    tags,
    // idList,
    idAttachmentCover,
  } = recipe

  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const query = useQueryParams()

  const openDetails = (): void => {
    setDetailsOpen(true)
  }

  const closeDetails = (): void => {
    setDetailsOpen(false)
  }

  React.useEffect(() => {
    if (query.get('open') === id) openDetails()
  }, [])

  return (
    <li
      className={
        detailsOpen ? `${styles.card} ${styles.details}` : `${styles.card}`
      }
    >
      <Link
        to={detailsOpen ? '' : `?open=${id}`}
        onClick={detailsOpen ? closeDetails : openDetails}
      >
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
      </Link>
      {detailsOpen ? <DetailLoader recipe={recipe} /> : null}
    </li>
  )
}
