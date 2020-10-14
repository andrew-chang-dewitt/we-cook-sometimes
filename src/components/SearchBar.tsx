// external dependencies
import React from 'react'

// other components
import Search from './icons/Search'

// CSS-modules
import styles from './SearchBar.module.sass'

interface Props {
  value: string
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  submitHandler?: (e: React.FormEvent<HTMLElement>) => void
}

export default ({ value, changeHandler, submitHandler }: Props) => {
  if (!submitHandler)
    submitHandler = (e) => {
      e.preventDefault()
    }

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
