// external dependencies
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

// other components
import SearchBar from '../SearchBar'

// CSS-modules
import styles from './NavMenu.module.sass'

export default () => {
  const history = useHistory()
  const [search, setSearch] = React.useState('')

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value)
  }
  const executeSearch = (e: React.FormEvent<HTMLElement>): void => {
    history.push(`/all-recipes?search=${search}`)
    e.preventDefault()
  }

  return (
    <ul className={styles.menu}>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/all-recipes">All recipes</Link>
      </li>
      <li className={styles.searchbar}>
        <SearchBar
          value={search}
          changeHandler={searchHandler}
          submitHandler={executeSearch}
        />
      </li>
    </ul>
  )
}
