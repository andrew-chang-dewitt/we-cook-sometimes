import React from 'react'

import { RecipeCard, Tag } from '../lib/data/schema'

export interface RecipeLookup {
  [key: string]: string
}
export interface RecipeByID {
  [key: string]: RecipeCard
}
export interface TagByID {
  [key: string]: Tag
}
export interface LookupTables {
  recipeByUrl: RecipeLookup
  recipeByID: RecipeByID
  tagsByID: TagByID
}

export default React.createContext<LookupTables>({
  recipeByUrl: {},
  recipeByID: {},
  tagsByID: {},
})
