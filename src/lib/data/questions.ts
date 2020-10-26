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

export const exclusionary = (
  text: string,
  tags: Array<string>
): Exclusionary => ({
  _tag: 'exclusionary',
  text,
  tagsEliminated: tags,
})

export const inclusionary = (
  text: string,
  tags: Array<string>
): Inclusionary => ({
  _tag: 'inclusionary',
  text,
  tagsRequired: tags,
})

export const isExclusionary = (choice: Choice): choice is Exclusionary =>
  choice._tag === 'exclusionary'

interface QuestionCore {
  id: string
  text: string
  choices: Array<Choice>
  possibleNexts: Array<string> // Array<Question.id>
}

interface SingleChoice extends QuestionCore {
  _tag: 'single'
}
interface MultiChoice extends QuestionCore {
  _tag: 'multi'
}

export const single = (data: QuestionCore): SingleChoice => ({
  ...data,
  _tag: 'single',
})
export const multi = (data: QuestionCore): MultiChoice => ({
  ...data,
  _tag: 'multi',
})

export const isSingleChoiceQuestion = (
  question: Question
): question is SingleChoice => question._tag === 'single'

export type Question = SingleChoice | MultiChoice

const questions: Array<Question> = [
  single({
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
  }),

  single({
    id: 'easy',
    text: 'Are you feeling...',
    choices: [
      inclusionary('Lazy', [
        '5820fc9e84e677fd363792e9', // easy
      ]),
      exclusionary('Not lazy', [
        '5820fc9e84e677fd363792e9', // easy
      ]),
    ],
    possibleNexts: ['party', 'fastSlow', 'fancy', 'meal'],
  }),

  single({
    id: 'fancy',
    text: 'Are you feeling...',
    choices: [
      inclusionary('Fancy', [
        '5820fc4a061669ff36d85f50', // fancy
      ]),
      exclusionary('Not fancy', [
        '5820fc4a061669ff36d85f50', // fancy
      ]),
    ],
    possibleNexts: ['party', 'easy'],
  }),

  multi({
    id: 'meal',
    text: 'Do you want...',
    choices: [
      inclusionary('Breakfast', [
        '5820fc0a10f309bba3d8e37a', // breakfast
      ]),
      inclusionary('Lunch', [
        '5820fc0fe6179a908622d2d2', // lunch
      ]),
      inclusionary('Dinner', [
        '5820fc13c6efcd83e1fae625', // dinner
      ]),
      inclusionary('Snack', [
        '5820f9c22043447d3f4fa85f', // snack
      ]),
    ],
    possibleNexts: ['easy', 'fastSlow', 'fancy'],
  }),

  multi({
    id: 'flavor',
    text: 'Are you feeling...',
    choices: [
      inclusionary('Spicy', ['5dd84833f481b06290eb1ecc']),
      inclusionary('Sweet', ['5c1bbbe668274c3e739b2590']),
      inclusionary('Sour', ['5f03a85d9ecda666647b6ee9']),
      inclusionary('Savory', ['5c1bbbeabe2f7158532a9c03']),
      // inclusionary('Bitter', [ '5c1bbb49e75cdb8a9b3e9618', ]),
    ],
    possibleNexts: ['meal', 'protein', 'cuisine'],
  }),

  multi({
    id: 'protein',
    text: 'Pick a protein:',
    choices: [
      inclusionary('Beef', ['5820fc1b34022f18c8ba44e0']),
      inclusionary('Lamb', ['5ca4b4bc3f5b757470608bee']),
      inclusionary('Pork', ['5820fbfc8ff793dec8f9d1a4']),
      inclusionary('Sausage', ['582f9f7084e677fd36645aba']),
      inclusionary('Duck', ['5c1bbb49e75cdb8a9b3e9618']),
      inclusionary('Chicken', ['5820fc02404c9790300516af']),
      inclusionary('Turkey', ['583b29ae84e677fd3680d4a7']),
      inclusionary('Seafood', ['5c1d066b34fff57f75201e05']),
      inclusionary('Egg', ['5ee79f50747c36365be6fd57']),
      inclusionary('Tofu', ['5dde8d51a74ee95f426a4ad6']),
    ],
    possibleNexts: ['cuisine', 'meal', 'cuisine'],
  }),

  multi({
    id: 'cuisine',
    text: 'Pick a cuisine:',
    choices: [
      inclusionary('Japanese', ['5dd7e53fab4a00396e333654']),
      inclusionary('Chinese', ['5cab4b8730cdb388e871be5d']),
      inclusionary('Sichuan', ['5dd8480cbb9143711b46e21a']),
      inclusionary('Indian', ['5d43358555b95771bc203922']),
      inclusionary('Western', ['5f71253eb8f52b5d31d9989b']),
      inclusionary('Thai', ['5ee7a260e763741b25e45640']),
      inclusionary('Taiwanese', ['5ceade3e01f0764348eecf39']),
      inclusionary('Italian', ['5dde8cc2d3108918348ed554']),
      inclusionary('fusion', ['5f7125307129a16f7c76d211']),
    ],
    possibleNexts: ['meal', 'protein'],
  }),

  multi({
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
  }),

  single({
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
  }),
]

export default questions
