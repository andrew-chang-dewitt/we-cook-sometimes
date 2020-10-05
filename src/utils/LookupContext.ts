import React from 'react'

import { Recipe } from '../lib/data/fetch'

export interface RecipeLookup {
  [key: string]: string
}
export interface RecipeByID {
  [key: string]: Recipe
}
export interface LookupTables {
  recipeByUrl: RecipeLookup
  recipeByID: RecipeByID
}

export default React.createContext<LookupTables>({
  recipeByUrl: {},
  recipeByID: {},
})
