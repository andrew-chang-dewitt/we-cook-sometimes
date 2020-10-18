import 'mocha'
import { expect } from 'chai'

import { exclusionary, inclusionary } from '../data/questions'
import QuestionSeries, {
  QuestionSeries as QuestionSeriesType,
} from './QuestionSeries'

export const questions = [
  {
    id: 'fastSlow',
    text: 'Do you want something...',
    choices: [
      inclusionary('Fast', [
        '5820fc2b2eb2fd6a055b4010', // fast
      ]),
      exclusionary('Slow', [
        '5820fc2b2eb2fd6a055b4010', // fast
      ]),
    ],
    possibleNexts: ['party', 'drinkSnackMeal'],
  },

  {
    id: 'drinkSnackMeal',
    text: 'Are you feeling...',
    choices: [
      inclusionary('Thirsty', [
        '5a4fcea4c1682b628ae07675', // drink
      ]),
      inclusionary('Snacky', [
        '5820f9c22043447d3f4fa85f', // snack
      ]),
      inclusionary('Hungry', [
        '5820f9c22043447d3f4fa85e', // entree
      ]),
    ],
    possibleNexts: [],
  },

  {
    id: 'party',
    text: 'Party party party?',
    choices: [
      inclusionary('Party', [
        '5b523e941fefa9b7b80066a2', // party
      ]),
      exclusionary('No party', [
        '5b523e941fefa9b7b80066a2', // party
      ]),
    ],
    possibleNexts: ['drinkSnackMeal'],
  },
]

describe('lib/core/QuestionSeries', () => {
  it('knows what the current question is', () => {
    expect(QuestionSeries.create(questions).current?.text).to.equal(
      'Do you want something...'
    )
  })

  describe('next()', () => {
    let originalSeries: QuestionSeriesType
    let newSeries: QuestionSeriesType

    before(() => {
      originalSeries = QuestionSeries.create(questions)
    })

    it('returns QuestionSeries with an updated current value', () => {
      newSeries = originalSeries.next()

      expect(newSeries.current).to.not.be.null
      expect(newSeries.current).to.not.deep.equal(originalSeries.current)
    })

    it('without altering the original instance of the series', () => {
      expect(newSeries).to.not.deep.equal(originalSeries)
    })

    it('sets current to null when there are no more questions left in the series', () => {
      const noMore = originalSeries.next().next().next()

      expect(noMore.current).to.be.null
    })
  })
})
