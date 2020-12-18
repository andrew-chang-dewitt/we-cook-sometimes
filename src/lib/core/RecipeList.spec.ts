// testing tools
import 'mocha'
import { expect } from 'chai'
import Factories from '../../testUtils/Factories'

// module under test
import RecipeList from './RecipeList'

describe('lib/core/RecipeList', () => {
  describe('properties', () => {
    const data = [
      Factories.schema.RecipeCard.createWithProperties({
        id: 'recipe1',
        name: 'a recipe',
      }),
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
    const recipe1 = Factories.schema.RecipeCard.createWithProperties({
      id: 'recipe1',
      name: 'a recipe',
      tags: ['tag1'],
    })
    const recipe2 = Factories.schema.RecipeCard.createWithProperties({
      id: 'recipe2',
      name: 'another recipe',
      tags: ['tag1', 'tag2'],
    })
    const recipe3 = Factories.schema.RecipeCard.createWithProperties({
      id: 'recipe3',
      name: 'yet another recipe',
      tags: ['tag1', 'tag2', 'tag3'],
    })
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
    const recipe1 = Factories.schema.RecipeCard.createWithProperties({
      id: 'recipe1',
      name: 'a recipe',
      tags: ['tag1'],
    })
    const recipe2 = Factories.schema.RecipeCard.createWithProperties({
      id: 'recipe2',
      name: 'another recipe',
      tags: ['tag1', 'tag2'],
    })
    const recipe3 = Factories.schema.RecipeCard.createWithProperties({
      id: 'recipe3',
      name: 'yet another recipe',
      tags: ['tag1', 'tag2', 'tag3'],
    })
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
