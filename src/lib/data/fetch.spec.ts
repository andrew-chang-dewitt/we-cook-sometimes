import 'mocha'
import { expect } from 'chai'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { trello } from './fetch'

describe('lib/Fetch', () => {
  const server = setupServer(
    rest.get('https://api.trello.com/1/test', (_, res, ctx) => {
      return res(ctx.json({ data: 'This is Fetch' }))
    })
  )

  before(() => {
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })
  after(() => {
    server.close()
  })

  it('returns data from a given API endpoint', async () => {
    expect(await trello('test')).to.deep.equal({ data: 'This is Fetch' })
  })
})
