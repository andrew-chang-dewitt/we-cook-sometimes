import Graph, {
  Graph as GraphType,
  CycleError,
  Traverser,
} from '../utils/Graph'
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
  readonly graph: GraphType
  readonly current: Question | null
  iterator: Traverser<string>
}

export interface QuestionSeries {
  readonly allById: QuestionsByID
  readonly graph: GraphType // FIXME: remove this from interface
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

  get graph() {
    return state.graph
  },
})

const nextable = (state: State): { next: Next } => ({
  next: () => {
    const nextId = state.iterator.next()
    const nextQuestion = nextId !== null ? state.allById[nextId] : nextId

    return QuestionSeriesBuilder({ ...state, current: nextQuestion })
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

  const iterator = graph.traverser()
  const next = iterator.next()
  let current: Question | null
  /* istanbul ignore else */
  if (next !== null) current = allById[next]
  else current = null

  const state: State = {
    allById,
    graph,
    iterator,
    current,
  }

  return QuestionSeriesBuilder(state)
}

export default {
  create,
}
