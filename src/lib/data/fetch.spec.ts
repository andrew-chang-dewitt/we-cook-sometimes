import 'mocha'
import { expect } from 'chai'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { recipes, tags, details, image, Tag, ImageAPI } from './fetch'

const Factories = {
  API: {
    Image: {
      create: (): ImageAPI => ({
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
      }),

      createWithId: (id: string): ImageAPI => {
        const img = Factories.API.Image.create()
        img.id = id

        return img
      },

      createWithProperties: (
        properties: { key: string; value: any }[]
      ): ImageAPI => {
        const img = Factories.API.Image.create()

        properties.map(({ key, value }) => {
          img[key] = value
        })

        return img
      },
    },
  },
}

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
    const imgObj = Factories.API.Image.create()

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
      expect((await image('1', '1', { height: 9, width: 9 })).url).to.equal(
        'url10'
      )
    })

    it('only requires a min height or a width to be specified', async () => {
      expect((await image('1', '1', { height: 100 })).url).to.deep.equal(
        'url100'
      )
    })

    it('must be >= both, if two dimensions are given', async () => {
      expect(
        (await image('1', '1', { height: 1, width: 100 })).url
      ).to.deep.equal('url100')
    })

    it("returns the largest available, if there isn't one any bigger", async () => {
      expect(
        (await image('1', '1', { height: 101, width: 101 })).url
      ).to.deep.equal('url100')
    })
  })

  it('tags() returns a list of labels for the board', async () => {
    const labels = [('a label' as any) as Tag]
    server.use(
      rest.get(root + board + '/labels', (_, res, ctx) => res(ctx.json(labels)))
    )

    expect(await tags()).to.deep.equal(labels)
  })

  describe('recipes()', () => {
    const card1 = {
      id: '1',
      name: 'one',
      idAttachmentCover: 'img1',
      idList: 'list1',
      labels: [
        {
          name: 'a label',
        },
      ],
    }
    const card2 = {
      id: '2',
      name: 'two',
      idAttachmentCover: 'img2',
      idList: 'list2',
      labels: [
        {
          name: 'published',
        },
      ],
    }

    beforeEach(() => {
      server.use(
        rest.get(root + board + '/cards', (_, res, ctx) =>
          res(ctx.json([card1, card2]))
        )
      )
      server.use(
        rest.get(`${root}/card/2/attachments/img2`, (_, res, ctx) =>
          res(ctx.json(Factories.API.Image.createWithId('imgId')))
        )
      )
    })

    it('returns a list of published cards', async () => {
      const result = await recipes()

      expect(result).to.have.lengthOf(1)
      expect(result[0].id).to.equal(card2.id)
      expect(result[0].name).to.equal(card2.name)
      expect(result[0].idList).to.equal(card2.idList)
      expect(result[0].tags).to.deep.equal(card2.labels)
      // because the image property is also a Promise, it needs unwrapped
      // here with an await (in addition to the one when defining result)
      expect((await result[0].coverImage).id).to.equal('imgId')
    })

    it('can specify a minimum height and/or width for the cover images, to be handled by image()', async () => {
      const result = await recipes({ height: 10, width: 10 })

      expect((await result[0].coverImage).url).to.equal('url10')
    })
  })

  describe('details()', () => {
    const card = {
      id: '1',
      desc: 'description',
    }
    const images = [
      Factories.API.Image.createWithProperties([
        { key: 'id', value: 'img1' },
        {
          key: 'previews',
          value: [
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
      ]),
      Factories.API.Image.createWithProperties([
        { key: 'id', value: 'img2' },
        {
          key: 'previews',
          value: [
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
      ]),
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
      const result = await details('1')

      expect(result.id).to.equal('1')
      expect(result.desc).to.equal('description')
      expect(result.images[0].id).to.equal('img1')
      expect(result.images[1].id).to.equal('img2')
    })

    it('can return the smallest scaled images that are still >= the optionally given dimensions', async () => {
      const result = await details('1', { height: 10, width: 10 })

      expect(result.images[0].url).to.equal('url1-10')
      expect(result.images[1].url).to.equal('url2-10')
    })

    it('only requires a min height or a width to be specified', async () => {
      const result = await details('1', { width: 100 })

      expect(result.images[0].url).to.equal('url1-100')
      expect(result.images[1].url).to.equal('url2-100')
    })

    it('must be >= both, if two dimensions are given', async () => {
      const result = await details('1', { height: 1, width: 100 })

      expect(result.images[0].url).to.equal('url1-100')
      expect(result.images[1].url).to.equal('url2-100')
    })

    it("returns the largest available, if there isn't one any bigger", async () => {
      const result = await details('1', { height: 101, width: 101 })

      expect(result.images[0].url).to.equal('url1-100')
      expect(result.images[1].url).to.equal('url2-100')
    })
  })
})
