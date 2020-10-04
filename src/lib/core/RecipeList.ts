import * as fetch from '../data/fetch'

const hashById = (recipes: fetch.Recipe[]): fetch.RecipesById => {
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

interface ExternalState {
  readonly allByID: fetch.RecipesById
  readonly remaining: string[]
}

interface State extends ExternalState {
  readonly allByTags: fetch.RecipesByLabelId
}

interface Eliminator {
  (tagIds: string[]): RecipeList
}

interface Filter {
  (tagId: string): RecipeList
}

export interface RecipeList extends ExternalState {
  eliminateByTags: Eliminator
  filterByTag: Filter
}

const getable = ({ allByID, remaining }: ExternalState): ExternalState => {
  return {
    get allByID() {
      return allByID
    },
    get remaining() {
      return remaining
    },
  }
}

const eliminatable = (state: State): { eliminateByTags: Eliminator } => {
  const { allByTags, remaining } = state

  return {
    eliminateByTags: (tagIds) => {
      // make a copy of remaining, to not mutate the
      // previous state
      let newRemaining: string[] = [...remaining]

      tagIds.forEach((tag) => {
        newRemaining = newRemaining.filter(
          (recipeId) => !allByTags[tag].includes(recipeId)
        )
      })

      return createFromExisting({
        ...state,
        remaining: newRemaining,
      })
    },
  }
}

const filterable = (state: State): { filterByTag: Filter } => {
  const { allByTags } = state

  return {
    filterByTag: (tag) =>
      createFromExisting({
        ...state,
        remaining: allByTags[tag],
      }),
  }
}

const createFromExisting = (state: State): RecipeList =>
  Object.assign({}, getable(state), eliminatable(state), filterable(state))

const create = (data: fetch.Recipe[]): RecipeList => {
  // build lookup tables
  const allByID = hashById(data)
  const allByTags = hashByTags(data)

  // initialize list of recipes not yet eliminated as
  // an array of all recipe IDs
  const remaining = Object.keys(allByID)

  return createFromExisting({ allByID, allByTags, remaining })
}

export default {
  create: create,
}
