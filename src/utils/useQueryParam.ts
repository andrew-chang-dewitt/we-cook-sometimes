import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

export default <T>(
  query: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const location = useLocation()
  const history = useHistory()

  let params = new URLSearchParams(location.search)

  const parseString = (str: string | null): T => {
    if (str === null) return defaultValue

    // if the query is a plain string object,
    // JSON.parse can't handle it
    try {
      return JSON.parse(str)
    } catch (e) {
      // not testing else as it shouldn't happen in the first place
      // & currently has no actual handling of the error
      /* istanbul ignore else */
      if (e instanceof SyntaxError) return (str as unknown) as T
      else throw e
    }
  }
  const buildString = (value: T): string => {
    if (typeof value === 'string') return value
    else return JSON.stringify(value)
  }

  const navigate = (to: string): void => {
    history.push({
      ...location,
      search: to,
    })
  }

  const [value, setValue] = React.useState<T>(parseString(params.get(query)))

  const update = (newValue: T): void => {
    setValue(newValue)

    params.set(query, buildString(newValue))
    navigate(params.toString())
  }

  // forward & back button behavior
  React.useEffect(() => {
    return history.listen((newLocation, action) => {
      params = new URLSearchParams(newLocation.search)

      // not testing else as no action other than POP is
      // handled here & testing the absence of an action
      // in this scenario achieves nothing
      /* istanbul ignore else */
      if (action === 'POP') {
        setValue(parseString(params.get(query)))
      }
    })
  }, [])

  return [value, update]
}
