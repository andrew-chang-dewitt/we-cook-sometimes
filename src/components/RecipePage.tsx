// external dependencies
import React from 'react'
import { useParams } from 'react-router-dom'

// internal dependencies
import LookupContext from '../utils/LookupContext'

// other components
import DetailLoader from './detail/DetailLoader'
import ImageLoader from './images/ImageLoader'

// CSS-modules
import styles from './RecipePage.module.sass'

export default () => {
  const { recipeID } = useParams()
  const recipeByID = React.useContext(LookupContext).recipeByID
  const recipe = recipeByID[recipeID]

  return (
    <>
      <div className={styles.imgContainer}>
        {recipe.idAttachmentCover !== null ? (
          <ImageLoader
            cardId={recipe.id}
            attachmentId={recipe.idAttachmentCover}
            size={{ width: 640 }}
          />
        ) : null}
      </div>
      <DetailLoader recipe={recipe} />
    </>
  )
}
