/* istanbul ignore file */

import * as fetchLib from '../lib/data/fetch'
import {
  exclusionary,
  inclusionary,
  single,
  multi,
  Question,
  Choice,
} from '../lib/data/questions'

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

    createWithProperties: (properties: any): fetchLib.Recipe => {
      const recipe = fetch.Recipe.create()

      return {
        ...recipe,
        ...(properties as fetchLib.Recipe),
      }
    },
  },
}

interface QuestionProps {
  id?: string
  text?: string
  choices?: Array<Choice>
  possibleNexts?: Array<string> // Array<Question.id>
}

export const questions = {
  Question: {
    create: (): Question =>
      single({
        id: 'question',
        text: 'Question',
        choices: [
          inclusionary('include', ['aTag']),
          exclusionary('exclude', ['aTag']),
        ],
        possibleNexts: [],
      }),

    createSingle: (): Question =>
      single({
        id: 'question',
        text: 'Question',
        choices: [
          inclusionary('include', ['aTag']),
          exclusionary('exclude', ['aTag']),
        ],
        possibleNexts: [],
      }),

    createMulti: (): Question =>
      multi({
        id: 'question',
        text: 'Question',
        choices: [
          inclusionary('include', ['aTag']),
          exclusionary('exclude', ['aTag']),
        ],
        possibleNexts: [],
      }),

    createWithProperties: (properties: QuestionProps): Question => {
      const question = questions.Question.create()

      return {
        ...question,
        ...properties,
      }
    },

    createSingleWithProperties: (properties: QuestionProps): Question => {
      const question = questions.Question.createSingle()

      return {
        ...question,
        ...properties,
      }
    },

    createMultiWithProperties: (properties: QuestionProps): Question => {
      const question = questions.Question.createMulti()

      return {
        ...question,
        ...properties,
      }
    },
  },

  Choice: {
    createInclusionary: (): Choice => inclusionary('A choice', []),

    createExclusionary: (): Choice => exclusionary('A choice', []),

    createInclusionaryWithProperties: (properties: {
      text?: string
      tagsRequired?: Array<string>
    }): Choice => {
      const choice = questions.Choice.createInclusionary()

      return {
        ...choice,
        ...properties,
      }
    },

    createExclusionaryWithProperties: (properties: {
      text?: string
      tagsEliminated?: Array<string>
    }): Choice => {
      const choice = questions.Choice.createExclusionary()

      return {
        ...choice,
        ...properties,
      }
    },
  },
}

export default { questions, fetch }
