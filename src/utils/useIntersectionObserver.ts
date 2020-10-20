/*
 * Testing Issues:
 *
 * So far unable to find a good way to test this hook without writing some
 * extremely brittle tests that are entirely too reliant on questionable
 * mocks/stubs & direct testing of implementation details. This is because,
 * at this time, JSDOM does not mock IntersectionObserver & the details of
 * mocking it are too complicated to be worth trying to do here. If this
 * changes in the future, it may be worth revisiting testing this hook. For
 * now, the entire hook is excluded from test coverage reports.
 *
 */
/* istanbul ignore file */

// external libraries
import React from 'react'

// not a complete definition of the possible options that can be passed to
// an intersection observer, properties will need added if more are used
interface IOOptions {
  threshold?: number | Array<number>
  rootMargin?: string
}

// inconsistent use function declaration syntax due to
// https://github.com/Microsoft/TypeScript/issues/4922
export function useIntersectionObserver<T extends Element>(
  nodeRef: React.RefObject<T>,
  options: IOOptions
): IntersectionObserverEntry {
  // store IO entries as React state objects to trigger render updates
  // where the returned entry variable is used
  // requires an initial value to avoid having to handle possible undefined
  // type when dealing with returned entry, casting an empty object
  // as IntersectionObserverEntry is easier than individually defining the
  // right types
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>(
    {} as IntersectionObserverEntry
  )
  const observer = React.useRef(
    new IntersectionObserver(([newEntry]: IntersectionObserverEntry[]) => {
      // store entry as state to return from hook
      setEntry(newEntry)
    }, options)
  )

  // whenever the nodeRef changes, register an observer on the new
  // value of nodeRef's current property
  React.useEffect(() => {
    nodeRef.current ? observer.current.observe(nodeRef.current) : null
  }, [nodeRef.current])

  return entry
}
