export const trelloFetch = (endpoint: string) => {
  const root = 'https://api.trello.com/1/'

  // guard against fetch being undefined for server-side calls
  let fetch

  if (!fetch) {
    fetch = require('node-fetch')
  }

  return fetch(root + endpoint).then((res: any) => res.json())
}
