export const trello = (endpoint: string) => {
  const root = 'https://api.trello.com/1/'

  // guard against fetch being undefined for server-side calls
  let fetch

  if (!fetch) {
    fetch = require('node-fetch')
  }

  return fetch(root + endpoint).then((res: any) => res.json())
}

export interface Card {
  id: string
  name: string
  desc: string
  labels: Label[]
  idAttachmentCover: string
}

interface Label {
  id: string
  idBoard: string
  idList: string
  name: string
  color: string
}
