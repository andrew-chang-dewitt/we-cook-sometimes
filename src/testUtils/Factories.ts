/* istanbul ignore file */

import * as fetchLib from '../lib/data/fetch'
import * as schemaLib from '../lib/data/schema'
import {
  exclusionary,
  inclusionary,
  single,
  multi,
  Question,
  Choice,
} from '../lib/data/questions'

interface TagProps {
  id?: string
  idBoard?: string
  name?: string
  color?: string
}

export class Tag {
  static create(): schemaLib.Tag {
    return {
      id: 'id',
      idBoard: 'idBoard',
      name: 'name',
      color: 'color,',
    }
  }

  static createWithProperties(props: TagProps): schemaLib.Tag {
    return {
      ...Tag.create(),
      ...props,
    }
  }
}

interface ImageProps {
  id?: string
  edgeColor?: string
  name?: string
  url?: string
  scaled?: Array<schemaLib.ScaledImage>
}

export class Image {
  static create(): schemaLib.Image {
    return {
      id: 'id',
      edgeColor: 'edgeColor',
      name: 'name',
      url: 'url',
      scaled: [],
    }
  }

  static createWithProperties(props: ImageProps): schemaLib.Image {
    return {
      ...Image.create(),
      ...props,
    }
  }
}

interface RecipeCardProps {
  id?: string
  name?: string
  shortLink?: string
  idList?: string
  cover?: schemaLib.Image | null
  tags?: Array<string>
}

export class RecipeCard {
  static create(): schemaLib.RecipeCard {
    return {
      id: 'id',
      name: 'name',
      shortLink: 'shortLink',
      tags: ['tagId'],
      cover: Image.create(),
      idList: 'idList',
    }
  }

  static createWithProperties(props: RecipeCardProps): schemaLib.RecipeCard {
    return {
      ...RecipeCard.create(),
      ...props,
    }
  }
}

interface RecipeDetailsProps {
  id?: string
  desc?: string
  images?: Array<schemaLib.Image>
}

export class RecipeDetails {
  static create(): schemaLib.RecipeDetails {
    return {
      id: 'id',
      desc: 'description',
      images: [Image.create()],
    }
  }

  static createWithProperties(
    props: RecipeDetailsProps
  ): schemaLib.RecipeDetails {
    return {
      ...RecipeDetails.create(),
      ...props,
    }
  }
}

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

export default {
  questions,
  fetch,
  schema: { Tag, Image, RecipeCard, RecipeDetails },
}
