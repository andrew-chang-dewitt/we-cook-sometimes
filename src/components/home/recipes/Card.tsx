// external libraries
import React from 'react'

// internal utilities
import { Recipe } from '../../../lib/data/fetch'

// core logic
import { publishedTagId } from '../../../lib/data/fetch'

// other components
import TagsList from '../../tags/List'
import ImageLoader from '../../images/ImageLoader'
import DetailLoader from '../../detail/DetailLoader'
import More from '../../icons/More'
import Less from '../../icons/Close'
import WIP from '../../WIPTag'

// CSS-modules
import styles from './Card.module.sass'

interface Props {
  recipe: Recipe
  detailsOpen: boolean
  openHandler: (newValue: string) => void
}

export default ({ recipe, detailsOpen, openHandler }: Props) => {
  const { id, name, tags, idAttachmentCover } = recipe
  const processedName = tags.every((tag) => tag.id !== publishedTagId) ? (
    <>
      {name} <WIP />
    </>
  ) : (
    <>{name}</>
  )

  const toggleOpen = (e: React.MouseEvent<HTMLElement>): void => {
    openHandler(detailsOpen ? '' : id)
    e.preventDefault()
  }

  // if a card is open, scroll it into view by getting a ref
  // on the parent element & calling it's scrollIntoView()
  // method in a useEffect to wait for component mounting
  const ref = React.useRef<HTMLLIElement>(null)

  // unable to test this behavior without writing really brittle
  // tests in enzyme that mock useEffect & spying on
  // HTMLElement.prototype.scrollIntoView, or modeling the entire
  // tree with react-testing-library & being forced to mock
  // location behavior, which proved to require really brittle
  // tests as well, skipping this useEffect instead
  /* istanbul ignore next */
  React.useEffect(() => {
    if (detailsOpen && ref.current) {
      const yOffset = -48
      const y =
        ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y })
    }
    // detailsOpen && ref.current
    //   ? ref.current.scrollIntoView({ block: 'start' })
    //   : null
  }, [detailsOpen, ref.current])

  return (
    <li
      className={
        detailsOpen ? `${styles.card} ${styles.details}` : `${styles.card}`
      }
      ref={ref}
    >
      <a href={`/recipe/${id}`} onClick={toggleOpen}>
        <div
          className={`${styles.imgContainer} ${
            idAttachmentCover ? styles.hasImage : ''
          }`}
        >
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
        {!detailsOpen ? (
          <h3 className={styles.title}>{processedName}</h3>
        ) : null}
      </a>

      {detailsOpen ? <DetailLoader recipe={recipe} /> : null}
    </li>
  )
}
