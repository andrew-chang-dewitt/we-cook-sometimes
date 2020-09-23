import 'mocha'
import { expect } from 'chai'

import QuestionSeries, {
  QuestionSeries as QuestionSeriesType,
} from './QuestionSeries'
import { Question } from '../data/questions'

const questions = [
  {
    id: 'fastSlow',
    text: 'Do you want something...',
    choices: [
      {
        text: 'Fast',
        tagsEliminated: [
          '5820fc8584e677fd36379283', // long-prep
          '5cab4ba748fca31b2ec6529d', // long-cook
        ],
      },

      {
        text: 'Slow',
        tagsEliminated: ['5820fc2b2eb2fd6a055b4010'], // fast
      },
    ],
    possibleNexts: ['party', 'drinkSnackMeal'],
  },

  {
    id: 'drinkSnackMeal',
    text: 'Are you feeling...',
    choices: [
      {
        text: 'Thirsty',
        tagsEliminated: [
          '5820f9c22043447d3f4fa85f', // snack
          '5820f9c22043447d3f4fa85e', // entree
        ],
      },
      {
        text: 'Snacky',
        tagsEliminated: [
          '5a4fcea4c1682b628ae07675', // drink
          '5820f9c22043447d3f4fa85e', // entree
        ],
      },
      {
        text: 'Hungry',
        tagsEliminated: [
          '5a4fcea4c1682b628ae07675', // drink
          '5820f9c22043447d3f4fa85f', // snack
        ],
      },
    ],
    possibleNexts: [],
  },

  {
    id: 'party',
    text: 'Party party party?',
    choices: [
      {
        text: 'Party',
        tagsEliminated: [],
      },
      {
        text: 'No Party',
        tagsEliminated: ['5b523e941fefa9b7b80066a2'],
      },
    ],
    possibleNexts: ['drinkSnackMeal'],
  },
]

describe('lib/core/QuestionSeries', () => {
  it('builds a directed acyclic Graph of questions', () => {
    expect(QuestionSeries.create(questions).graph.adjacencyList).to.deep.equal({
      fastSlow: ['party', 'drinkSnackMeal'],
      party: ['drinkSnackMeal'],
      drinkSnackMeal: [],
    })
  })

  it('silently prevents adding a next question as an edge if it would have formed a cycle', () => {
    const cycle = ({
      id: 'cycle',
      possibleNexts: ['fastSlow'],
    } as any) as Question
    let qs = questions
    qs[2].possibleNexts.push('cycle')
    qs.push(cycle)

    expect(
      QuestionSeries.create(qs).graph.adjacencyList['cycle']
    ).to.deep.equal([])
  })

  describe('next()', () => {
    let originalSeries: QuestionSeriesType
    let newSeries: QuestionSeriesType

    before(() => {
      originalSeries = QuestionSeries.create(questions)
    })

    it('returns QuestionSeries with an updated current value', () => {
      newSeries = originalSeries.next()

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
