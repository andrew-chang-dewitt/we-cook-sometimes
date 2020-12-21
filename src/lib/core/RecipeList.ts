import * as Data from '../data/schema'

interface ExternalState {
  readonly allByID: RecipesById
  readonly remaining: string[]
}

interface State extends ExternalState {
  readonly allByTags: RecipesByLabelId
}

export interface RecipeList extends ExternalState {
  eliminateByTags: (tags: Array<string>) => RecipeList
  filterByTag: (tagId: string) => RecipeList
}

const RecipeListBuilder = (state: State): RecipeList => ({
  get allByID() {
    return state.allByID
  },
  get remaining() {
    return state.remaining
  },
  eliminateByTags: (tags: Array<string>) => eliminateByTags(state, tags),
  filterByTag: (tag: string) => filterByTag(state, tag),
})

const eliminateByTags = (state: State, tags: Array<string>): RecipeList => {
  // make a copy of remaining, to not mutate the
  // previous state
  let newRemaining: string[] = [...state.remaining]

  tags.forEach((tag) => {
    newRemaining = newRemaining.filter(
      (recipeId) => !state.allByTags[tag].includes(recipeId)
    )
  })

  return RecipeListBuilder({
    ...state,
    remaining: newRemaining,
  })
}

const filterByTag = (state: State, tag: string): RecipeList =>
  RecipeListBuilder({
    ...state,
    remaining: state.remaining.filter((recipe) =>
      state.allByID[recipe].tags.includes(tag)
    ),
  })

interface RecipesById {
  [index: string]: Data.RecipeCard
}

const hashById = (recipes: Array<Data.RecipeCard>): RecipesById => {
  let result: RecipesById = {}

  recipes.forEach((recipe) => {
    result[recipe.id] = recipe
  })

  return result
}

interface RecipesByLabelId {
  [index: string]: Array<string>
}

const hashByTags = (recipes: Array<Data.RecipeCard>): RecipesByLabelId => {
  let result: RecipesByLabelId = {}

  recipes.forEach((recipe) => {
    recipe.tags.forEach((tag) => {
      if (result[tag]) result[tag].push(recipe.id)
      else result[tag] = [recipe.id]
    })
  })

  return result
}

const create = (data: Array<Data.RecipeCard>): RecipeList => {
  // build lookup tables
  const allByID = hashById(data)
  const allByTags = hashByTags(data)

  // initialize list of recipes not yet eliminated as
  // an array of all recipe IDs
  const remaining = Object.keys(allByID)

  return RecipeListBuilder({ allByID, allByTags, remaining })
}

export default {
  create: create,
}
