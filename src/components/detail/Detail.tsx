// external libs
import React from 'react'

// core logic
import { Recipe, RecipeDetails } from '../../lib/data/fetch'

// other components
import TagsList from '../tags/List'
import Content from './Content'
import ImageCarousel, { isImage, isVideo } from './ImageCarousel'

import styles from './Detail.module.sass'

interface Props {
  details: RecipeDetails
  recipe: Recipe
}

export default ({ details, recipe }: Props) => {
  const { desc, images } = details
  const { name, tags } = recipe

  return (
    <div className={styles.detail}>
      <div className={styles.readingContent}>
        <h2 className={styles.title}>{name}</h2>
        <TagsList tags={tags} />
        <Content data={desc} />
      </div>
      <ImageCarousel
        attachments={images.filter((img) => isImage(img) || isVideo(img))}
      />
    </div>
  )
}
