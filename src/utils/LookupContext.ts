import React from 'react'

import { RecipeCard } from '../lib/data/schema'

export interface RecipeLookup {
  [key: string]: string
}
export interface RecipeByID {
  [key: string]: RecipeCard
}
export interface LookupTables {
  recipeByUrl: RecipeLookup
  recipeByID: RecipeByID
}

export default React.createContext<LookupTables>({
  recipeByUrl: {},
  recipeByID: {},
})
