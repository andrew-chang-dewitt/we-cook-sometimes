export type Exclusionary = {
  _tag: 'exclusionary'
  text: string
  tagsEliminated: Array<string>
}

export type Inclusionary = {
  _tag: 'inclusionary'
  text: string
  tagsRequired: Array<string>
}

export type Choice = Exclusionary | Inclusionary

export const exclusionary = (text: string, tags: Array<string>): Exclusionary => ({
  _tag: 'exclusionary',
  text,
  tagsEliminated: tags,
})

export const inclusionary = (text: string, tags: Array<string>): Inclusionary => ({
  _tag: 'inclusionary',
  text,
  tagsRequired: tags,
})

export const isExclusionary = (choice: Choice): choice is Exclusionary =>
  choice._tag === 'exclusionary'

export interface Question {
  id: string
  text: string
  choices: Array<Choice>
  possibleNexts: Array<string> // Array<Question.id>
}

export default [
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
] as Array<Question>
