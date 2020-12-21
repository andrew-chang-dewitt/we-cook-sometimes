// external libraries
import React from 'react'

// core logic
import { RecipeCard } from '../../../lib/data/schema'
import { publishedTagId } from '../../../lib/data/fetch'

// other components
import LayoutContext from '../../LayoutContext'
import LookupContext from '../../../utils/LookupContext'
import TagsList from '../../tags/List'
import Image from '../../images/Image'
import DetailLoader from '../../detail/DetailLoader'
import More from '../../icons/More'
import Less from '../../icons/Close'
import WIP from '../../WIPTag'

// CSS-modules
import styles from './Card.module.sass'

interface Props {
  recipe: RecipeCard
  detailsOpen: boolean
  openHandler: (newValue: string) => void
}

export default ({ recipe, detailsOpen, openHandler }: Props) => {
  const { id, name, tags, cover } = recipe
  const layoutConstants = React.useContext(LayoutContext)
  const { tagsByID } = React.useContext(LookupContext)

  const processedName = tags.every((tag) => tag !== publishedTagId) ? (
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
      const y =
        ref.current.getBoundingClientRect().top +
        window.pageYOffset +
        -1 * layoutConstants.scrollYOffset

      window.scrollTo({ top: y })
    }
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
          className={`${styles.imgContainer} ${cover ? styles.hasImage : ''}`}
        >
          <div className={styles.info}>
            {!detailsOpen ? (
              <>
                <div>
                  <TagsList
                    tags={tags
                      .map((id) => tagsByID[id])
                      .filter((tag) => tag.color !== null)}
                  />
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

          {cover !== null ? <Image data={cover} /> : null}
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
