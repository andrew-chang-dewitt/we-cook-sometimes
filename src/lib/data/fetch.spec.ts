import 'mocha'
import { expect } from 'chai'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { recipes, tags, details, image, Tag, Recipe } from './fetch'

describe('lib/data/fetch', () => {
  const root = 'https://api.trello.com/1'
  const board = '/board/5820f9c22043447d3f4fa857'

  const server = setupServer()

  before(() => {
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })
  after(() => {
    server.close()
  })

  describe('image()', () => {
    const imgObj = {
      id: '1',
      name: 'name',
      edgeColor: 'color',
      url: 'url',
      previews: [
        {
          height: 1,
          width: 1,
          url: 'url1',
        },
        {
          height: 10,
          width: 10,
          url: 'url10',
        },
        {
          height: 100,
          width: 100,
          url: 'url100',
        },
      ],
    }

    beforeEach(() => {
      server.use(
        rest.get(root + '/card/1/attachments/1', (_, res, ctx) =>
          res(ctx.json(imgObj))
        )
      )
    })

    it('returns an Image object for a given recipe & image ID', async () => {
      expect(await image('1', '1')).to.deep.equal({
        url: 'url',
        id: imgObj.id,
        name: imgObj.name,
        edgeColor: imgObj.edgeColor,
      })
    })

    it('can return the smallest scaled image that is still >= the optionally given dimensions', async () => {
      expect(await image('1', '1', { height: 9, width: 9 })).to.deep.equal({
        url: 'url10',
        id: imgObj.id,
        name: imgObj.name,
        edgeColor: imgObj.edgeColor,
      })
    })

    it('only requires a min height or a width to be specified', async () => {
      expect(await image('1', '1', { height: 100 })).to.deep.equal({
        url: 'url100',
        id: imgObj.id,
        name: imgObj.name,
        edgeColor: imgObj.edgeColor,
      })
    })

    it('must be >= both, if two dimensions are given', async () => {
      expect(await image('1', '1', { height: 1, width: 100 })).to.deep.equal({
        url: 'url100',
        id: imgObj.id,
        name: imgObj.name,
        edgeColor: imgObj.edgeColor,
      })
    })

    it("returns the largest available, if there isn't one any bigger", async () => {
      expect(await image('1', '1', { height: 101, width: 101 })).to.deep.equal({
        url: 'url100',
        id: imgObj.id,
        name: imgObj.name,
        edgeColor: imgObj.edgeColor,
      })
    })
  })

  it('tags() returns a list of labels for the board', async () => {
    const labels = [('a label' as any) as Tag]
    server.use(
      rest.get(root + board + '/labels', (_, res, ctx) => res(ctx.json(labels)))
    )

    expect(await tags()).to.deep.equal(labels)
  })

  it('recipes() returns a list of published cards', async () => {
    const card1 = {
      labels: [
        {
          name: 'a label',
        },
      ],
    } as Recipe
    const card2 = {
      labels: [
        {
          name: 'published',
        },
      ],
    } as Recipe
    server.use(
      rest.get(root + board + '/cards', (_, res, ctx) =>
        res(ctx.json([card1, card2]))
      )
    )
    expect(await recipes()).to.deep.equal([card2])
  })

  describe('details()', () => {
    const card = {
      id: '1',
      desc: 'description',
    }
    const images = [
      {
        id: 'img1',
        url: 'url1',
        edgeColor: 'color1',
        name: 'name1',
        previews: [
          {
            url: 'url1-1',
            height: 1,
            width: 1,
          },
          {
            url: 'url1-10',
            height: 10,
            width: 10,
          },
          {
            url: 'url1-100',
            height: 100,
            width: 100,
          },
        ],
      },
      {
        id: 'img2',
        url: 'url2',
        edgeColor: 'color2',
        name: 'name2',
        previews: [
          {
            url: 'url2-1',
            height: 1,
            width: 1,
          },
          {
            url: 'url2-10',
            height: 10,
            width: 10,
          },
          {
            url: 'url2-100',
            height: 100,
            width: 100,
          },
        ],
      },
    ]

    beforeEach(() => {
      server.use(
        rest.get(root + '/card/1', (_, res, ctx) => res(ctx.json(card)))
      )
      server.use(
        rest.get(root + '/card/1/attachments', (_, res, ctx) =>
          res(ctx.json(images))
        )
      )
    })

    it('returns the extra details for a given recipe', async () => {
      expect(await details('1')).to.deep.equal({
        id: '1',
        desc: 'description',
        images: [
          {
            id: 'img1',
            url: 'url1',
            edgeColor: 'color1',
            name: 'name1',
          },
          {
            id: 'img2',
            url: 'url2',
            edgeColor: 'color2',
            name: 'name2',
          },
        ],
      })
    })

    it('can return the smallest scaled images that are still >= the optionally given dimensions', async () => {
      expect(await details('1', { height: 10, width: 10 })).to.deep.equal({
        id: '1',
        desc: 'description',
        images: [
          {
            id: 'img1',
            url: 'url1-10',
            edgeColor: 'color1',
            name: 'name1',
          },
          {
            id: 'img2',
            url: 'url2-10',
            edgeColor: 'color2',
            name: 'name2',
          },
        ],
      })
    })

    it('only requires a min height or a width to be specified', async () => {
      expect(await details('1', { width: 100 })).to.deep.equal({
        id: '1',
        desc: 'description',
        images: [
          {
            id: 'img1',
            url: 'url1-100',
            edgeColor: 'color1',
            name: 'name1',
          },
          {
            id: 'img2',
            url: 'url2-100',
            edgeColor: 'color2',
            name: 'name2',
          },
        ],
      })
    })

    it('must be >= both, if two dimensions are given', async () => {
      expect(await details('1', { height: 1, width: 100 })).to.deep.equal({
        id: '1',
        desc: 'description',
        images: [
          {
            id: 'img1',
            url: 'url1-100',
            edgeColor: 'color1',
            name: 'name1',
          },
          {
            id: 'img2',
            url: 'url2-100',
            edgeColor: 'color2',
            name: 'name2',
          },
        ],
      })
    })

    it("returns the largest available, if there isn't one any bigger", async () => {
      expect(await details('1', { height: 101, width: 101 })).to.deep.equal({
        id: '1',
        desc: 'description',
        images: [
          {
            id: 'img1',
            url: 'url1-100',
            edgeColor: 'color1',
            name: 'name1',
          },
          {
            id: 'img2',
            url: 'url2-100',
            edgeColor: 'color2',
            name: 'name2',
          },
        ],
      })
    })
  })
})
