import * as fetch from './fetch'
import { Card } from './fetch'

export const recipes = () => {
  return fetch
    .trello(
      'board/5820f9c22043447d3f4fa857/cards?fields=id,name,idList,labels,idAttachmentCover'
    )
    .then((results: Card[]) => {
      let filtered: Card[] = []

      results.forEach((result) => {
        result.labels.some((label) => label.name === 'published')
          ? filtered.push(result)
          : null
      })

      return filtered
    })
}
