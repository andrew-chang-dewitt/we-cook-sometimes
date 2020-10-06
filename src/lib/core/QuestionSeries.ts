import Graph, { CycleError } from '../utils/Graph'
import shuffle from '../../utils/FisherYatesShuffle'
import { Question } from '../data/questions'

interface QuestionsByID {
  [questionId: string]: Question
}

const hashById = (questions: Question[]): QuestionsByID => {
  let result: QuestionsByID = {}

  questions.forEach((question) => {
    result[question.id] = question
  })

  return result
}

interface State {
  readonly allById: QuestionsByID
  readonly current: Question | null
  readonly index: number
  readonly order: Array<string>
}

export interface QuestionSeries {
  readonly allById: QuestionsByID
  readonly current: Question | null
  next: Next
}

interface Next {
  (): QuestionSeries
}

const QuestionSeriesBuilder = (state: State): QuestionSeries =>
  Object.assign({}, getters(state), nextable(state))

const getters = (state: State): State => ({
  ...state,

  get allById() {
    return state.allById
  },

  get current() {
    return state.current
  },
})

const nextable = (state: State): { next: Next } => ({
  next: () => {
    const nextIndex = state.index + 1
    const nextQuestion =
      nextIndex <= state.order.length - 1
        ? state.allById[state.order[nextIndex]]
        : null

    return QuestionSeriesBuilder({
      ...state,
      index: nextIndex,
      current: nextQuestion,
    })
  },
})

const create = (questions: Question[]): QuestionSeries => {
  const allById = hashById(questions)
  let graph = Graph.create({}, true, true)

  const sorted = [...questions].sort(
    // sort from longest possible next questions array to shortest
    (a, b) => b.possibleNexts.length - a.possibleNexts.length
  )

  graph = sorted.reduce((nodeAccumulator, question) => {
    if (!nodeAccumulator.adjacencyList.hasOwnProperty(question.id))
      nodeAccumulator = nodeAccumulator.addNode(question.id)

    if (question.possibleNexts.length > 0) {
      return question.possibleNexts.reduce((edgeAccumulator, next) => {
        try {
          return edgeAccumulator.addEdge(question.id, next)
        } catch (err) {
          /* istanbul ignore else */
          if (err instanceof CycleError) return edgeAccumulator
          /* istanbul ignore next */ else throw err
        }
      }, nodeAccumulator)
    } else return nodeAccumulator
  }, graph)

  const shuffler = (arr: Array<string>): Array<string> =>
    shuffle(arr, Math.random)

  const order = graph.flatten(shuffler)
  const index = 0
  const current = allById[order[index]]

  const state: State = {
    allById,
    index,
    current,
    order,
  }

  return QuestionSeriesBuilder(state)
}

export default {
  create,
}
