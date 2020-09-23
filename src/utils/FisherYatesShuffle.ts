export default <T>(array: Array<T>, rng: () => number): Array<T> => {
  let countUnshuffled = array.length

  while (countUnshuffled > 1) {
    countUnshuffled--

    const lastUnshuffled = array[countUnshuffled]
    const shuffleIndex = Math.floor(rng() * countUnshuffled)
    const shuffling = array[shuffleIndex]

    array[countUnshuffled] = shuffling
    array[shuffleIndex] = lastUnshuffled
  }

  return array
}
