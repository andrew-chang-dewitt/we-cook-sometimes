import React from 'react'

import { Recipe } from '../../lib/data/fetch'
import Card from './Card'

import styles from './List.module.sass'

interface Props {
  recipes: Recipe[]
  openId: string | null
}

export default ({ recipes, openId }: Props) => (
  <ul className={styles.cardsList}>
    {recipes.map((recipe) => (
      <Card
        recipe={recipe}
        key={recipe.id}
        detailsOpen={openId === recipe.id}
      />
    ))}
  </ul>
)
