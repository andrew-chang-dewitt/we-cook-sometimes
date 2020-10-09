import 'mocha'
import { expect } from 'chai'

import * as fetch from '../data/fetch'
import { Factories as fetchFactories } from '../data/fetch.spec'
import RecipeList from './RecipeList'

const Factories = {
  Fetch: {
    Recipe: {
      create: (): fetch.Recipe =>
        ({
          id: 'recipeId',
          name: 'recipeName',
          tags: [
            fetchFactories.API.Tag.createWithData({
              id: 'tagId',
              name: 'tag',
            }),
          ],
        } as fetch.Recipe),

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
      ]),
    ]
    let recipeList: any

    before(() => {
      recipeList = RecipeList.create(data)
    })

    it('has a list of all recipes, hashed by ID', () => {
      expect(recipeList.allByID['recipe1'].name).to.equal('a recipe')
    })

    it('knows the IDs for all remaining recipes', () => {
      expect(recipeList.remaining[0]).to.equal('recipe1')
    })
  })

  describe('elminateByTags()', () => {
    const tag1 = fetchFactories.API.Tag.createWithData({
      id: 'tag1',
      name: 'on all',
    })
    const tag2 = fetchFactories.API.Tag.createWithData({
      id: 'tag2',
      name: 'on two',
    })
    const tag3 = fetchFactories.API.Tag.createWithData({
      id: 'tag3',
      name: 'on one',
    })
    const recipe1 = Factories.Fetch.Recipe.createWithProperties([
      {
        key: 'id',
        value: 'recipe1',
      },
      {
        key: 'name',
        value: 'a recipe',
      },
      { key: 'tags', value: [tag1] },
    ])
    const recipe2 = Factories.Fetch.Recipe.createWithProperties([
      {
        key: 'id',
        value: 'recipe2',
      },
      {
        key: 'name',
        value: 'another recipe',
      },
      { key: 'tags', value: [tag1, tag2] },
    ])
    const recipe3 = Factories.Fetch.Recipe.createWithProperties([
      {
        key: 'id',
        value: 'recipe3',
      },
      {
        key: 'name',
        value: 'yet another recipe',
      },
      { key: 'tags', value: [tag1, tag2, tag3] },
    ])
    const data = [recipe1, recipe2, recipe3]
    let recipeList: any

    before(() => {
      recipeList = RecipeList.create(data)
    })

    it("returns a RecipeList with any recipe that has a given tag (ID) removed from it's remaining list", () => {
      expect(recipeList.eliminateByTags(['tag3']).remaining).to.deep.equal([
        'recipe1',
        'recipe2',
      ])
    })

    it('but the original RecipeList remains unaltered', () => {
      expect(recipeList.remaining).to.deep.equal([
        'recipe1',
        'recipe2',
        'recipe3',
      ])
    })
  })

  describe('filterByTags()', () => {
    const tag1 = fetchFactories.API.Tag.createWithData({
      id: 'tag1',
      name: 'on all',
    })
    const tag2 = fetchFactories.API.Tag.createWithData({
      id: 'tag2',
      name: 'on two',
    })
    const tag3 = fetchFactories.API.Tag.createWithData({
      id: 'tag3',
      name: 'on one',
    })
    const recipe1 = Factories.Fetch.Recipe.createWithProperties([
      {
        key: 'id',
        value: 'recipe1',
      },
      {
        key: 'name',
        value: 'a recipe',
      },
      { key: 'tags', value: [tag1] },
    ])
    const recipe2 = Factories.Fetch.Recipe.createWithProperties([
      {
        key: 'id',
        value: 'recipe2',
      },
      {
        key: 'name',
        value: 'another recipe',
      },
      { key: 'tags', value: [tag1, tag2] },
    ])
    const recipe3 = Factories.Fetch.Recipe.createWithProperties([
      {
        key: 'id',
        value: 'recipe3',
      },
      {
        key: 'name',
        value: 'yet another recipe',
      },
      { key: 'tags', value: [tag1, tag2, tag3] },
    ])
    const data = [recipe1, recipe2, recipe3]
    let recipeList: any

    before(() => {
      recipeList = RecipeList.create(data)
    })

    it("returns a RecipeList with any recipe that doesn't a given tag (ID) removed from it's remaining list", () => {
      expect(recipeList.filterByTag('tag2').remaining).to.deep.equal([
        'recipe2',
        'recipe3',
      ])
    })

    it('but the original RecipeList remains unaltered', () => {
      expect(recipeList.remaining).to.deep.equal([
        'recipe1',
        'recipe2',
        'recipe3',
      ])
    })

    it('returns only those that have the specified tag that were still remaining', () => {
      const list = recipeList.filterByTag('tag3')

      expect(list.filterByTag('tag2').remaining).to.deep.equal(['recipe3'])
    })
  })
})
