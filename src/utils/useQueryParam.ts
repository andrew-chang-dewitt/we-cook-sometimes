import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

export default <T>(
  query: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const location = useLocation()
  const history = useHistory()

  let params = new URLSearchParams(location.search)

  const navigate = (to: string): void => {
    history.push({
      ...location,
      search: to,
    })
  }

  const parseString = (str: string | null): T => {
    if (str === null) return defaultValue

    // if the query is a plain string object,
    // JSON.parse can't handle it
    try {
      return JSON.parse(str)
    } catch (e) {
      if (e instanceof SyntaxError) return (str as unknown) as T
      else throw e
    }
  }
  const buildString = (value: T): string => {
    if (typeof value === 'string') return value
    else return JSON.stringify(value)
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

      if (action === 'POP') {
        setValue(parseString(params.get(query)))
      }
    })
  }, [])

  return [value, update]
}
