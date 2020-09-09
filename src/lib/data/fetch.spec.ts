import 'mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

chai.use(chaiAsPromised)
const expect = chai.expect

import {
  recipes,
  tags,
  details,
  image,
  Tag,
  ImageAPI,
  RecipeAPI,
} from './fetch'

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

    Recipe: {
      create: (): RecipeAPI => ({
        id: 'id',
        name: 'one',
        idAttachmentCover: 'img',
        idList: 'list',
        labels: [
          Factories.API.Tag.createWithData({
            id: 'labelATag',
            name: 'a tag',
          }),
        ],
      }),

      createWithProperties: (
        properties: { key: string; value: any }[]
      ): RecipeAPI => {
        const recipe = Factories.API.Recipe.create()

        properties.map(({ key, value }) => {
          recipe[key] = value
        })

        return recipe
      },
    },

    Tag: {
      createWithData: (data: { id: string; name: string }): Tag => data as Tag,
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
      expect((await image('1', '1', { height: 100 })).url).to.equal('url100')
    })

    it('but at least one must be given, despite being optional on the MinDimensions interface', () => {
      expect(image('1', '1', {}))
        .to.eventually.be.rejectedWith(
          'at least one property on minDimensions must be provided: {}'
        )
        .and.be.an.instanceOf(TypeError)
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
    const card1 = Factories.API.Recipe.createWithProperties([
      { key: 'id', value: 'recipe1' },
      {
        key: 'labels',
        value: [
          { id: 'labelCommon', name: 'common' },
          { id: 'labelALabel', name: 'a label' },
        ],
      },
    ])
    const card2 = Factories.API.Recipe.createWithProperties([
      { key: 'id', value: 'recipe2' },
      {
        key: 'labels',
        value: [
          { id: 'labelCommon', name: 'common' },
          { id: 'labelPublished', name: 'published' },
          { id: 'labelAUniqueLabel', name: 'a unique label' },
        ],
      },
    ])
    const card3 = Factories.API.Recipe.createWithProperties([
      { key: 'id', value: 'recipe3' },
      {
        key: 'labels',
        value: [
          { id: 'labelCommon', name: 'common' },
          { id: 'labelPublished', name: 'published' },
          { id: 'labelADifferentLabel', name: 'a different label' },
        ],
      },
    ])

    beforeEach(() => {
      server.use(
        rest.get(root + board + '/cards', (_, res, ctx) =>
          res(ctx.json([card1, card2, card3]))
        )
      )
      server.use(
        rest.get(`${root}/card/recipe1/attachments/img`, (_, res, ctx) =>
          res(ctx.json(Factories.API.Image.createWithId('imgId')))
        )
      )
      server.use(
        rest.get(`${root}/card/recipe2/attachments/img`, (_, res, ctx) =>
          res(ctx.json(Factories.API.Image.createWithId('imgId')))
        )
      )
      server.use(
        rest.get(`${root}/card/recipe3/attachments/img`, (_, res, ctx) =>
          res(ctx.json(Factories.API.Image.createWithId('imgId')))
        )
      )
    })

    it('returns a hashmap of recipes indexed by their ID', async () => {
      const result = await recipes()

      expect(result.list['recipe1'].id).to.equal('recipe1')
      expect(result.list['recipe2'].id).to.equal('recipe2')
      expect(result.list['recipe3'].id).to.equal('recipe3')
    })

    it('also returns a hashmap of recipeIDs indexed by labelID', async () => {
      const result = await recipes()

      expect(result.hashedByLabels).to.deep.equal({
        labelCommon: ['recipe1', 'recipe2', 'recipe3'],
        labelPublished: ['recipe2', 'recipe3'],
        labelALabel: ['recipe1'],
        labelAUniqueLabel: ['recipe2'],
        labelADifferentLabel: ['recipe3'],
      })
    })

    it('can specify a minimum height and/or width for the cover images, to be handled by image()', async () => {
      const result = await recipes({ height: 10, width: 10 })

      expect((await result.list['recipe2'].coverImage).url).to.equal('url10')
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
