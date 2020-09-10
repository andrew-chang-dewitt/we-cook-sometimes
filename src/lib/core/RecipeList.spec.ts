import 'mocha'
import { expect } from 'chai'

import * as fetch from '../data/fetch'
import { Factories as fetchFactories } from '../data/fetch.spec'
import RecipeList from './RecipeList'

const Factories = {
  Fetch: {
    Recipe: {
      create: (): fetch.Recipe => ({
        id: 'recipeId',
        name: 'recipeName',
        tags: [
          fetchFactories.API.Tag.createWithData({
            id: 'tagId',
            name: 'tag',
          }),
        ],
        coverImage: Promise.resolve(('image' as any) as fetch.Image),
        idList: 'listId',
      }),

      createWithProperties: (
        properties: { key: string; value: any }[]
      ): fetch.Recipe => {
        const recipe = Factories.Fetch.Recipe.create()

        properties.map(({ key, value }) => {
          recipe[key] = value
        })

        return recipe
      },
    },
  },
}

describe('lib/core/RecipeList', () => {
  describe('properties', () => {
    const data = [
      Factories.Fetch.Recipe.createWithProperties([
        {
          key: 'id',
          value: 'recipe1',
        },
        {
          key: 'name',
          value: 'a recipe',
        },
        {
          key: 'tags',
          value: [
            {
              id: 'label1',
              name: 'label1',
            },
          ],
        },
      ]),
    ]
    let recipeList: any

    before(() => {
      recipeList = RecipeList.create(data)
    })

    it('has a lookup table of all recipes hashed by their ID', () => {
      expect(recipeList.allByID.recipe1.name).to.equal('a recipe')
    })

    it('has a lookup table of recipeIDs hashed by tag ID', () => {
      expect(recipeList.allByTags.label1[0]).to.deep.equal('recipe1')
    })

    it('has a lookup table of remaining recipes hashed by their ID', () => {
      expect(recipeList.remaining.recipe1.name).to.equal('a recipe')
    })
  })

  // describe('elminateByLabels()', () => {})
})
