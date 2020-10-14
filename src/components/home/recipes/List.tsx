// external dependencies
import React from 'react'

// internal utilities
import useQueryParam from '../../../utils/useQueryParam'

// core logic
import { Recipe } from '../../../lib/data/fetch'

// other components
import Card from './Card'

import styles from './List.module.sass'

interface Props {
  recipes: Recipe[]
}

export default ({ recipes }: Props) => {
  const [open, setOpen] = useQueryParam('open', '')

  return (
    <ul className={styles.cardsList}>
      {recipes.map((recipe) => (
        <Card
          recipe={recipe}
          key={recipe.id}
          detailsOpen={open === recipe.id}
          openHandler={setOpen}
        />
      ))}
    </ul>
  )
}
