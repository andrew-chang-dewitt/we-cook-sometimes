import React from 'react'
import { useLocation } from 'react-router-dom'

import { Recipe } from '../../lib/data/fetch'
import Card from './Card'

import styles from './List.module.sass'

const useQueryParams = (location: { search: string }) =>
  new URLSearchParams(location.search)

interface Props {
  recipes: Recipe[]
}

export default ({ recipes }: Props) => {
  const location = useLocation()
  const query = useQueryParams(location)

  return (
    <ul className={styles.cardsList}>
      {recipes.map((recipe) => (
        <Card
          recipe={recipe}
          key={recipe.id}
          detailsOpen={query.get('open') === recipe.id}
        />
      ))}
    </ul>
  )
}
