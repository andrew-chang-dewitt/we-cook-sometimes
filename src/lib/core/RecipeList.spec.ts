// testing tools
import 'mocha'
import { expect } from 'chai'
import DataFactories from '../../testUtils/Factories'

// dependencies
import * as fetch from '../data/fetch'

// module under test
import RecipeList from './RecipeList'

describe('lib/core/RecipeList', () => {
  describe('properties', () => {
    const data = [
      DataFactories.fetch.Recipe.createWithProperties({
        id: 'recipe1',
        name: 'a recipe',
      } as fetch.Recipe),
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
    const tag1 = DataFactories.fetch.API.Tag.createWithData({
      id: 'tag1',
      name: 'on all',
    })
    const tag2 = DataFactories.fetch.API.Tag.createWithData({
      id: 'tag2',
      name: 'on two',
    })
    const tag3 = DataFactories.fetch.API.Tag.createWithData({
      id: 'tag3',
      name: 'on one',
    })
    const recipe1 = DataFactories.fetch.Recipe.createWithProperties({
      id: 'recipe1',
      name: 'a recipe',
      tags: [tag1],
    } as fetch.Recipe)
    const recipe2 = DataFactories.fetch.Recipe.createWithProperties({
      id: 'recipe2',
      name: 'another recipe',
      tags: [tag1, tag2],
    } as fetch.Recipe)
    const recipe3 = DataFactories.fetch.Recipe.createWithProperties({
      id: 'recipe3',
      name: 'yet another recipe',
      tags: [tag1, tag2, tag3],
    } as fetch.Recipe)
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
    const tag1 = DataFactories.fetch.API.Tag.createWithData({
      id: 'tag1',
      name: 'on all',
    })
    const tag2 = DataFactories.fetch.API.Tag.createWithData({
      id: 'tag2',
      name: 'on two',
    })
    const tag3 = DataFactories.fetch.API.Tag.createWithData({
      id: 'tag3',
      name: 'on one',
    })
    const recipe1 = DataFactories.fetch.Recipe.createWithProperties({
      id: 'recipe1',
      name: 'a recipe',
      tags: [tag1],
    } as fetch.Recipe)
    const recipe2 = DataFactories.fetch.Recipe.createWithProperties({
      id: 'recipe2',
      name: 'another recipe',
      tags: [tag1, tag2],
    } as fetch.Recipe)
    const recipe3 = DataFactories.fetch.Recipe.createWithProperties({
      id: 'recipe3',
      name: 'yet another recipe',
      tags: [tag1, tag2, tag3],
    } as fetch.Recipe)
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
