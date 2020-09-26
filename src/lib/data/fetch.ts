import { ok, err, mergeResults, Result } from '../../utils/Result'
import { Response } from 'node-fetch'

const board = '/board/5820f9c22043447d3f4fa857'

export class FetchError extends Error {}

const trello = <T>(endpoint: string): Promise<Result<T, FetchError>> => {
  const root = 'https://api.trello.com/1'

  // guard against fetch being undefined for server-side calls
  let fetch
  // we don't need to test that fetch is correctly polyfilled
  /* istanbul ignore next */
  if (!fetch) {
    fetch = require('node-fetch')
  }

  return fetch(root + endpoint)
    .then((res: Response) => {
      if (!res.ok) throw new FetchError(`${res.status} ${res.statusText}`)
      return res
    })
    .then((res: Response) => res.json().then((json: T) => ok(json)))
    .catch((e: Error) => err(new FetchError(e.message)))
}

export type Tag = {
  id: string
  idBoard: string
  name: string
  color: string
}

export const tags = (): Promise<Result<Array<Tag>, FetchError>> =>
  trello<Array<Tag>>(board + '/labels')

type MinDimensions = {
  height?: number
  width?: number
}

type Preview = {
  url: string
  height: number
  width: number
}

export type Image = {
  id: string
  edgeColor: string
  url: string
  name: string
}

export interface ImageAPI extends Image {
  previews: Array<Preview>
  // adding dynamic property to allow for dynamic assignment in
  // test factories
  [index: string]: any
}

const isBigger = (
  img: Preview,
  { height = 0, width = 0 }: MinDimensions
): boolean => {
  const heightBigger = img.height >= height
  const widthBigger = img.width >= width

  return heightBigger && widthBigger
}

const findBestFit = (res: ImageAPI, minDimensions: MinDimensions): number => {
  let index = res.previews.length - 1

  // search previews for an image that's scaled to being only as
  // big as is needed
  res.previews.some((preview, current) => {
    const bigger = isBigger(preview, minDimensions)

    // when the first preview not bigger is found, store previous
    // index for extracting the preview's URL
    if (bigger) {
      index = current
    }

    // then return bigger to short circuit if true,
    // or continue if false
    return bigger
  })

  return index
}

const processImage = (img: ImageAPI, minDimensions?: MinDimensions): Image =>
  minDimensions
    ? {
        url: img.previews[findBestFit(img, minDimensions)].url,
        id: img.id,
        edgeColor: img.edgeColor,
        name: img.name,
      }
    : {
        url: img.url,
        id: img.id,
        edgeColor: img.edgeColor,
        name: img.name,
      }

export const image = (
  cardId: string,
  imageId: string,
  minDimensions?: MinDimensions
): Promise<Result<Image, FetchError>> => {
  if (minDimensions) {
    if (!minDimensions.height && !minDimensions.width) {
      return Promise.resolve(
        err(
          new FetchError(
            `at least one property on minDimensions must be provided: ${JSON.stringify(
              minDimensions
            )}`
          )
        )
      )
    }
  }

  return trello<ImageAPI>(
    `/card/${cardId}/attachments/${imageId}?fields=id,name,url,previews,edgeColor`
  ).then(
    (res) =>
      // type assertion needed here to identify the type returned by apply
      res.apply((img) => processImage(img, minDimensions)) as Result<
        Image,
        FetchError
      >
  )
}

export interface RecipeAPI {
  id: string
  name: string
  labels: Array<Tag>
  idAttachmentCover: string
  idList: string
  // adding dynamic property to allow for dynamic assignment in
  // test factories
  [index: string]: any
}

export interface Recipe {
  id: string
  name: string
  tags: Array<Tag>
  idAttachmentCover: string | null
  idList: string
  // adding dynamic property to allow for dynamic assignment in
  // test factories
  [index: string]: any
}

export interface RecipesById {
  [index: string]: Recipe
}

export interface RecipesByLabelId {
  [index: string]: Array<string>
}

export const recipes = (): Promise<Result<Array<Recipe>, FetchError>> => {
  const processRecipes = (recipes: Array<RecipeAPI>): Array<Recipe> =>
    recipes.map(({ id, name, idAttachmentCover, idList, labels }) => ({
      id,
      name,
      idAttachmentCover,
      idList,
      tags: labels,
    }))

  return trello<Array<RecipeAPI>>(
    board + '/cards?fields=id,name,idList,labels,idAttachmentCover'
  ).then(
    (res) => res.apply(processRecipes) as Result<Array<Recipe>, FetchError>
  )
}

export interface RecipeAPIDetails {
  id: string
  desc: string
}

export interface RecipeDetails extends RecipeAPIDetails {
  images: Array<ImageAPI>
}

export const details = async (
  id: string
): Promise<Result<RecipeDetails, FetchError>> => {
  const compileRecipeDetails = (
    { id, desc }: RecipeAPIDetails,
    images: Array<ImageAPI>
  ): RecipeDetails => ({
    id,
    desc,
    images,
  })

  const details = await trello<RecipeAPIDetails>(`/card/${id}?fields=id,desc`)
  const images = await trello<Array<ImageAPI>>(
    `/card/${id}/attachments?fields=id,name,url,previews,edgeColor`
  )

  return mergeResults(details, images, compileRecipeDetails)
}

export default {
  tags,
  image,
  recipes,
  details,
}
