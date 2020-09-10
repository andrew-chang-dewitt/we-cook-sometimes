import * as fetch from '../data/fetch'

const hashByID = (recipes: fetch.Recipe[]): fetch.RecipesById => {
  let result: fetch.RecipesById = {}

  recipes.forEach((recipe) => {
    result[recipe.id] = recipe
  })

  return result
}

const hashByTags = (recipes: fetch.Recipe[]): fetch.RecipesByLabelId => {
  let result: fetch.RecipesByLabelId = {}

  recipes.forEach((recipe) => {
    recipe.tags.forEach((tag) => {
      if (result[tag.id]) result[tag.id].push(recipe.id)
      else result[tag.id] = [recipe.id]
    })
  })

  return result
}

export interface RecipeList {
  allByID: fetch.RecipesById
  allByTags: fetch.RecipesByLabelId
  remaining: fetch.RecipesById
  // eliminateByTags: (tags: fetch.Tag[]) => RecipeList
}

const create = (data: fetch.Recipe[]): RecipeList => {
  const allByID = hashByID(data)

  return {
    allByID: allByID,
    allByTags: hashByTags(data),
    remaining: allByID,
    // eliminateByTags: (tags) => {

    // }
  }
}

export default {
  create: create,
}
