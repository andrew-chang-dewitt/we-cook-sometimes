import 'mocha'
import { expect } from 'chai'

import { ok, err, tryCatch } from './Result'

describe('src/utils/Result', () => {
  describe('creation functions', () => {
    it('ok() represent something that succeded', () => {
      expect(ok(1)).to.exist
    })

    it('err() represents something that failed', () => {
      expect(err(new Error())).to.exist
    })

    describe('tryCatch()', () => {
      it('wraps things that could succeed', () => {
        let executed = true
        const couldFail = () => {
          executed = true
          return "but it didn't"
        }

        tryCatch(couldFail, () => new Error('it failed'))

        expect(executed).to.be.true
      })

      it('or fail', () => {
        let executed = true
        const couldFail = () => {
          executed = true
          throw Error('error')
        }

        tryCatch(couldFail, () => new Error('it failed'))

        expect(executed).to.be.true
      })
    })
  })

  describe('Result methods', () => {
    describe('unwrap()', () => {
      it('returns the value of the result, if it is Ok', () => {
        expect(ok(1).unwrap()).to.equal(1)
      })

      it('otherwise, it throws the error', () => {
        expect(() => err(new Error('an error')).unwrap()).to.throw(
          Error,
          'an error'
        )
      })

      it("if an error handler is provided, it won't throw", () => {
        expect(() =>
          err(new Error('an error')).unwrap(() => {
            1
          })
        ).to.not.throw()
      })

      it('and the error handler can even allow unwrap to return a value despite the error', () => {
        expect(err(new Error('an error')).unwrap(() => 1)).to.equal(1)
      })
    })

    describe('map()', () => {
      it("executes a given Ok handler on an Ok Result's value & returns a new Result", () => {
        const result = ok(1)
        const mapped = result.map(
          (x) => x + 1,
          (e) => e
        )

        expect(mapped.unwrap()).to.equal(2)
        expect(result.unwrap()).to.equal(1)
      })

      it("executes a given Err handler on an Ok Result's value & returns a new Result", () => {
        const result = err(new Error('an error'))
        const mapped = result.map(
          (x) => x,
          (e) => new Error('modified error: ' + e.message)
        )

        expect(mapped.unwrap((e) => e.message)).to.equal(
          'modified error: an error'
        )
        expect(result.unwrap((e) => e.message)).to.equal('an error')
      })

      describe('shortcut map versions', () => {
        describe('mapOk()', () => {
          it('transforms an Ok value', () => {
            expect(
              ok(1)
                .mapOk((x) => x + 1)
                .unwrap()
            ).to.equal(2)
          })

          it("but doesn't touch an Err value", () => {
            expect(
              err(new Error('e'))
                .mapOk((x) => (x as number) + 1)
                .unwrap((e) => e.message)
            ).to.equal('e')
          })
        })

        describe('mapErr()', () => {
          it('transforms an Err value', () => {
            expect(
              err(new Error('e'))
                .mapErr((e) => new Error('modified: ' + e.message))
                .unwrap((e) => e.message)
            ).to.equal('modified: e')
          })

          it("but doesn't touch an Err value", () => {
            expect(
              ok(1)
                .mapErr((e) => new Error('modified: ' + e.message))
                .unwrap()
            ).to.equal(1)
          })
        })
      })
    })
  })
})
