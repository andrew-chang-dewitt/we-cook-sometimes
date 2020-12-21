// external libs
import React from 'react'

// core logic
import { RecipeCard, RecipeDetails } from '../../lib/data/schema'

// other components
import LookupContext from '../../utils/LookupContext'
import TagsList from '../tags/List'
import Content from './Content'
import ImageCarousel, { isImage, isVideo } from './ImageCarousel'

import styles from './Detail.module.sass'

interface Props {
  details: RecipeDetails
  recipe: RecipeCard
}

export default ({ details, recipe }: Props) => {
  const { tagsByID } = React.useContext(LookupContext)
  const { desc, images } = details
  const { name, tags } = recipe

  return (
    <div className={styles.detail}>
      <div className={styles.readingContent}>
        <h2 className={styles.title}>{name}</h2>
        <TagsList tags={tags.map((id) => tagsByID[id])} />
        <Content data={desc} />
      </div>
      <ImageCarousel
        attachments={images.filter((img) => isImage(img) || isVideo(img))}
      />
    </div>
  )
}
