import React from 'react'

import { Recipe } from '../../lib/data/fetch'
import Card from './Card'

import styles from './List.module.sass'

interface Props {
  recipes: Recipe[]
}

export default ({ recipes }: Props) => (
  <>
    <p>List</p>
    <ul className={styles.cardsList}>
      {recipes.map((recipe) => (
        <Card recipe={recipe} key={recipe.id} />
      ))}
    </ul>
  </>
)
