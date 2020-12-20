// external dependencies
import React from 'react'
import { useParams } from 'react-router-dom'

// internal dependencies
import LookupContext from '../utils/LookupContext'

// other components
import Layout from './Layout'
import DetailLoader from './detail/DetailLoader'
import Image from './images/Image'

// CSS-modules
import styles from './RecipePage.module.sass'

export default () => {
  const { recipeID } = useParams()
  const recipeByID = React.useContext(LookupContext).recipeByID
  const recipe = recipeByID[recipeID]

  return (
    <Layout>
      <div className={styles.imgContainer}>
        {recipe.cover !== null ? <Image data={recipe.cover} /> : null}
      </div>
      <DetailLoader recipe={recipe} />
    </Layout>
  )
}
