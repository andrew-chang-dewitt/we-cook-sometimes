import Graph, { Graph as GraphType } from '../utils/Graph'
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
}

export interface QuestionSeries extends State {}

const getters = ({ allById, graph }: State): QuestionSeries => ({
  get allById() {
    return allById
  },
  get graph() {
    return graph
  },
})

const create = (questions: Question[]): QuestionSeries => {
  const allById = hashById(questions)
  const graph = Graph.create()

  const sorted = [...questions]
    .sort((a, b) => (a.possibleNexts.length = b.possibleNexts.length))
    .reverse()

  sorted.forEach((question) => {
    graph.addVertex(question.id)
  })
  sorted.forEach((question) =>
    question.possibleNexts.forEach((next) => graph.addEdge(question.id, next))
  )

  return Object.assign({}, getters({ allById, graph }))
}

export default {
  create,
}
