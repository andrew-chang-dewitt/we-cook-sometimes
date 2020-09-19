type Ok<T> = { _tag: 'ok'; ok: T }
type Err<E extends Error> = { _tag: 'err'; err: E }

type ResultType<T, E extends Error> = Ok<T> | Err<E>

const okType = <T, E extends Error>(value: T): ResultType<T, E> => ({
  _tag: 'ok',
  ok: value,
})

const errType = <T, E extends Error>(value: E): ResultType<T, E> => ({
  _tag: 'err',
  err: value,
})

const isOk = <T, E extends Error>(result: ResultType<T, E>): result is Ok<T> =>
  result._tag === 'ok'

const isErr = <T, E extends Error>(
  result: ResultType<T, E>
): result is Err<E> => result._tag === 'err'

interface ErrorHandler<T, E extends Error> {
  (e: E): T | void
}

const unwrap = <T, E extends Error>(
  result: ResultType<T, E>,
  errHandler?: ErrorHandler<T, E>
): T | void => {
  if (isOk(result)) return result.ok
  if (errHandler !== undefined) return errHandler(result.err)
  else throw result.err
}

interface MapOkFn<T> {
  (okValue: T): T
}

const mapOk = <T, E extends Error>(
  result: ResultType<T, E>,
  fn: MapOkFn<T>
): ResultType<T, E> => {
  if (isOk(result)) return okType(fn(result.ok))
  else return result
}

interface MapErrFn<E extends Error> {
  (errValue: E): E
}

const mapErr = <T, E extends Error>(
  result: ResultType<T, E>,
  fn: MapErrFn<E>
): ResultType<T, E> => {
  if (isErr(result)) return errType(fn(result.err))
  else return result
}

const map = <T, E extends Error>(
  result: ResultType<T, E>,
  onOk: MapOkFn<T>,
  onErr: MapErrFn<E>
): ResultType<T, E> => {
  if (isOk(result)) return okType(onOk(result.ok))
  else return errType(onErr(result.err))
}

interface ApplyFn<T> {
  (x: T): unknown
}

const apply = <T, E extends Error>(
  result: ResultType<T, E>,
  onOk: ApplyFn<T>
): ResultType<unknown, E> => {
  if (isOk(result)) return okType(onOk(result.ok))
  else return result
}

export interface Result<T, E extends Error> {
  unwrap: (errorHandler?: (e: E) => T | void) => T | void
  map: (onOk: MapOkFn<T>, onErr: MapErrFn<E>) => Result<T, E>
  mapOk: (fn: MapOkFn<T>) => Result<T, E>
  mapErr: (fn: MapErrFn<E>) => Result<T, E>
  apply: (onOk: ApplyFn<T>) => Result<unknown, E>
}

const ResultBuilder = <T, E extends Error>(
  result: ResultType<T, E>
): Result<T, E> => ({
  unwrap: (errorHandler?: ErrorHandler<T, E>) => unwrap(result, errorHandler),
  map: (onOk, onErr) => ResultBuilder(map(result, onOk, onErr)),
  mapOk: (fn) => ResultBuilder(mapOk(result, fn)),
  mapErr: (fn) => ResultBuilder(mapErr(result, fn)),
  apply: (onOk) => ResultBuilder(apply(result, onOk)),
})

export const ok = <T, E extends Error>(value: T): Result<T, E> =>
  ResultBuilder(okType(value))

export const err = <T, E extends Error>(value: E): Result<T, E> =>
  ResultBuilder(errType(value))

export const tryCatch = <T, E extends Error>(
  callback: () => T,
  onError: (error: unknown) => E
): Result<T, E> => {
  try {
    return ok(callback())
  } catch (error) {
    return err(onError(error))
  }
}

interface MergeFn<A, B, C> {
  (a: A, b: B): C
}

export const mergeResults = <T, S, V, E extends Error>(
  a: Result<T, E>,
  b: Result<S, E>,
  mergeFn: MergeFn<T, S, V>
): Result<V, E> => {
  let aValue: T | void
  let bValue: S | void

  try {
    aValue = a.unwrap()
    bValue = b.unwrap()
  } catch (e) {
    return err(e)
  }

  // FIXME: I think this should never happen? unwrap() should only return
  // void if it is given an error handler
  /* istanbul ignore next */
  if (!aValue || !bValue)
    return err(new Error('unable to merge a void type') as E)

  return ok(mergeFn(aValue, bValue))
}
