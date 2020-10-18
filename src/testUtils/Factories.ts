import * as fetchLib from '../lib/data/fetch'
import { exclusionary, inclusionary, Question } from '../lib/data/questions'

export const fetch = {
  API: {
    Image: {
      create: (): fetchLib.ImageAPI => ({
        id: '1',
        name: '[published]name',
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

      createWithId: (id: string): fetchLib.ImageAPI => {
        const img = fetch.API.Image.create()
        img.id = id

        return img
      },

      createWithProperties: (
        properties: { key: string; value: any }[]
      ): fetchLib.ImageAPI => {
        const img = fetch.API.Image.create()

        properties.map(({ key, value }) => {
          img[key] = value
        })

        return img
      },
    },

    Recipe: {
      create: (): fetchLib.RecipeAPI => ({
        id: 'id',
        name: 'one',
        shortLink: 'https://a-link',
        idAttachmentCover: 'img',
        idList: 'list',
        labels: [
          fetch.API.Tag.createWithData({
            id: 'labelATag',
            name: 'a tag',
          }),
        ],
      }),

      createWithProperties: (
        properties: { key: string; value: any }[]
      ): fetchLib.RecipeAPI => {
        const recipe = fetch.API.Recipe.create()

        properties.map(({ key, value }) => {
          recipe[key] = value
        })

        return recipe
      },
    },

    Tag: {
      createWithData: (data: { id: string; name: string }): fetchLib.Tag =>
        data as fetchLib.Tag,
    },
  },

  Recipe: {
    create: (): fetchLib.Recipe =>
      ({
        id: 'recipeId',
        name: 'recipeName',
        tags: [
          fetch.API.Tag.createWithData({
            id: 'tagId',
            name: 'tag',
          }),
        ],
      } as fetchLib.Recipe),

    createWithProperties: (properties: fetchLib.Recipe): fetchLib.Recipe => {
      const recipe = fetch.Recipe.create()

      return {
        ...recipe,
        ...properties,
      }
    },
  },
}

export const questions = {
  Question: {
    create: (): Question => ({
      id: 'question',
      text: 'Question',
      choices: [
        inclusionary('include', ['aTag']),
        exclusionary('exclude', ['aTag']),
      ],
      possibleNexts: [],
    }),

    createWithProperties: (properties: Question): Question => {
      const question = questions.Question.create()

      return {
        ...question,
        ...properties,
      }
    },
  },

  Choice: {
    createInclusionary: inclusionary,
    createExclusionary: exclusionary,
  },
}

export default { questions, fetch }
