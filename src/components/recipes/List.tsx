import React from 'react'

import { Recipe } from '../../lib/data/fetch'
import Card from './Card'

interface Props {
  recipes: Recipe[]
}

export default ({ recipes }: Props) => (
  <>
    <p>List</p>
    <ul>
      {recipes.map((recipe) => (
        <Card recipe={recipe} />
      ))}
    </ul>
  </>
)
