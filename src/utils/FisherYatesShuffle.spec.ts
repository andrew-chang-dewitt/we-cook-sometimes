import 'mocha'
import { expect } from 'chai'

import shuffle from './FisherYatesShuffle'

describe('src/utils/FisherYatesShuffle', () => {
  it('returns a shuffled copy of a given array', () => {
    let fakeRandomNumbers = [4 / 5, 1 / 4, 1 / 3, 0, 1][Symbol.iterator]()

    /*
     * range  rand  scratch       result
     *              0,1,2,3,4,5
     * 0-5    4     0,1,2,3,5     4
     * 0-4    1     0,5,2,3       1,4
     * 0-3    1     0,3,2         5,1,4
     * 0-2    0     2,3           0,5,1,4
     * 0-1    1     2             3,0,5,1,4
     *
     */

    const rand = (): number => {
      const res = fakeRandomNumbers.next().value
      return res
    }

    expect(shuffle([0, 1, 2, 3, 4, 5], rand)).to.deep.equal([2, 3, 0, 5, 1, 4])
  })
})
