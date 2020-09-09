export interface Tag {
  id: string
  idBoard: string
  name: string
  color: string
}

const board = '/board/5820f9c22043447d3f4fa857'

const trello = <T>(endpoint: string): Promise<T> => {
  const root = 'https://api.trello.com/1'

  // guard against fetch being undefined for server-side calls
  let fetch

  if (!fetch) {
    fetch = require('node-fetch')
  }

  return fetch(root + endpoint).then((res: any) => res.json())
}

export const tags = (): Promise<Tag[]> => trello<Tag[]>(board + '/labels')

interface MinDimensions {
  height?: number
  width?: number
}

interface Preview {
  url: string
  height: number
  width: number
}

export interface Image {
  id: string
  edgeColor: string
  url: string
  name: string
}

export interface ImageAPI extends Image {
  previews: Array<Preview>
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
    // index for extracting the preview's url
    if (bigger) {
      index = current
    }

    // then return bigger to short circuit if true,
    // or continue if false
    return bigger
  })

  return index
}

export const image = (
  cardId: string,
  imageId: string,
  minDimensions: MinDimensions | null = null
): Promise<Image> => {
  if (minDimensions) {
    if (minDimensions.height === null && minDimensions.width === null) {
      throw TypeError(
        `at least one property on minDimensions must be provided: ${minDimensions}`
      )
    }
  }

  const api = trello<ImageAPI>(
    `/card/${cardId}/attachments/${imageId}?fields=id,name,url,previews`
  )

  // FIXME: I'm not sure this part is even working, but it needs pulled out
  // into a separate function so it can be used in recipeDetails() as well
  if (minDimensions)
    return api.then((res) => {
      const index = findBestFit(res, minDimensions)

      return {
        url: res.previews[index].url,
        id: res.id,
        edgeColor: res.edgeColor,
        name: res.name,
      }
    })
  else
    return api.then((res) => {
      return {
        url: res.url,
        id: res.id,
        edgeColor: res.edgeColor,
        name: res.name,
      }
    })
}

export interface Recipe {
  id: string
  name: string
  labels: Array<Tag>
  coverImage: Image
  idList: string
}

interface RecipeAPI {
  id: string
  name: string
  labels: Array<Tag>
  idAttachmentCover: string
  idList: string
}

export const recipes = (): Promise<RecipeAPI[]> => {
  const filterPublished = (cards: RecipeAPI[]) => {
    let filtered: RecipeAPI[] = []

    cards.forEach((card) => {
      card.labels.some((label) => label.name === 'published')
        ? filtered.push(card)
        : null
    })

    return filtered
  }

  return trello<RecipeAPI[]>(
    board + '/cards?fields=id,name,idList,labels,idAttachmentCover'
  ).then(filterPublished)
}

export interface RecipeAPIDetails {
  id: string
  desc: string
}

export interface RecipeDetails extends RecipeAPIDetails {
  images: Array<Image>
}

export const details = async (
  id: string,
  minDimensions: MinDimensions | null = null
): Promise<RecipeDetails> => {
  const card = await trello<RecipeAPIDetails>(`/card/${id}?fields=id,desc`)
  const imagesAPI = trello<ImageAPI[]>(
    `/card/${id}/attachments?fields=id,name,url,previews`
  )

  let images: Image[]

  if (minDimensions)
    images = await imagesAPI.then((results) =>
      results.map((res) => {
        const index = findBestFit(res, minDimensions)

        return {
          url: res.previews[index].url,
          id: res.id,
          edgeColor: res.edgeColor,
          name: res.name,
        }
      })
    )
  else
    images = await imagesAPI.then((results) =>
      results.map((res) => ({
        url: res.url,
        id: res.id,
        edgeColor: res.edgeColor,
        name: res.name,
      }))
    )

  return {
    images: images,
    id: card.id,
    desc: card.desc,
  }
}
