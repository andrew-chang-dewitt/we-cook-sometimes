export default <T>(array: Array<T>, rng: () => number): Array<T> => {
  let countUnshuffled = array.length
  console.log('before:', array)

  while (countUnshuffled > 1) {
    countUnshuffled--

    const lastUnshuffled = array[countUnshuffled]
    console.log('lastUnshuffled', lastUnshuffled)
    const shuffleIndex = Math.floor(rng() * countUnshuffled)
    console.log('shuffleIndex', shuffleIndex)
    const shuffling = array[shuffleIndex]
    console.log('shuffling', shuffling)

    array[countUnshuffled] = shuffling
    array[shuffleIndex] = lastUnshuffled

    console.log(array)
  }

  return array
}
