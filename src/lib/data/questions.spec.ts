import 'mocha'
import { expect } from 'chai'

import { exclusionary, inclusionary, isExclusionary } from './questions'

describe('lib/data/questions', () => {
  describe('Choice types', () => {
    it('can be exclusionary', () => {
      expect(exclusionary('name', ['tag'])).to.haveOwnProperty('tagsEliminated')
    })

    it('or inclusionary', () => {
      expect(inclusionary('name', ['tag'])).to.haveOwnProperty('tagsRequired')
    })

    it('includes a helper method for differentiating the two', () => {
      expect(isExclusionary(inclusionary('name', ['tag']))).to.be.false
    })
  })
})
