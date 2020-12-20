import { ok, err, Result } from '../../utils/Result'
import { Tag, RecipeCard, RecipeDetails } from './schema'

const rootPath = '/api/1a/'
export const publishedTagId = '5f55960c17f08e1fde18785e'

export class FetchError extends Error {}

const api = <T>(endpoint: string): Promise<Result<T, FetchError>> => fetch(rootPath + endpoint)
  .then((res: Response) => {
    if (!res.ok) throw new FetchError(`${res.status} ${res.statusText}`)

    return res
  })
  .then((res: Response) => res.json().then((json: T) => ok(json)))
  .catch((e: Error) => err(new FetchError(e.message)))


export const tags = (): Promise<Result<Array<Tag>, FetchError>> =>
  api<Array<Tag>>('tag/all')

export const recipes = (): Promise<Result<Array<RecipeCard>, FetchError>> =>
  api<Array<RecipeCard>>('recipe/all')

export const recipesPublished = (): Promise<
  Result<Array<RecipeCard>, FetchError>
> => api<Array<RecipeCard>>('recipe/published')

export const details = (
  id: string
): Promise<Result<RecipeDetails, FetchError>> =>
  api<RecipeDetails>(`recipe/details/${id}`)

export const search = (
  query: string
): Promise<Result<Array<RecipeCard>, FetchError>> =>
  api<Array<RecipeCard>>(`recipe/search/${query}`)

export default {
  tags,
  recipes,
  recipesPublished,
  details,
  search,
}
