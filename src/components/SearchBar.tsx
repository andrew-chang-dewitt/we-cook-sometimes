// external dependencies
import React from 'react'

// other components
import LayoutContext from './LayoutContext'
import Search from './icons/Search'

// CSS-modules
import styles from './SearchBar.module.sass'

interface Props {
  value: string
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  submitHandler?: (e: React.FormEvent<HTMLElement>) => void
}

export default ({ value, changeHandler, submitHandler }: Props) => {
  // skip testing this as there doesn't seem to be a way to test
  // that e.preventDefault worked using React Testing Library
  /* istanbul ignore next */
  if (!submitHandler)
    submitHandler = (e) => {
      e.preventDefault()
    }

  const setYOffset = React.useContext(LayoutContext).setScrollYOffset

  React.useEffect(() => {
    setYOffset(70)
  }, [])

  return (
    <form className={styles.container} onSubmit={submitHandler}>
      <input
        type="text"
        title="Search all recipes"
        placeholder="Search recipes"
        className={styles.input}
        value={value}
        onChange={changeHandler}
      />
      <button type="submit" className={styles.button}>
        <Search />
      </button>
    </form>
  )
}
