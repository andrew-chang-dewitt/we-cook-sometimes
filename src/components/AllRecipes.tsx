// external dependencies
import React from 'react'

// internal utilities
import useQueryParam from '../utils/useQueryParam'

// core logic
import fetch from '../lib/data/fetch'
import RecipeList, {
  RecipeList as RecipeListType,
} from '../lib/core/RecipeList'

// other components
import Layout from './Layout'
import List from './home/recipes/List'
import SearchBar from './SearchBar'

// CSS-modules
import styles from './AllRecipes.module.sass'

interface Props {
  recipes: RecipeListType
}

export default ({ recipes }: Props) => {
  const EMPTY_SEARCH = ''
  const [search, setSearch] = useQueryParam<string>('search', EMPTY_SEARCH)
  const [list, setList] = React.useState<RecipeListType | null>(null)

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value)
    e.preventDefault()
  }

  React.useEffect(() => {
    if (search !== EMPTY_SEARCH)
      fetch
        .search(search)
        .then((res) => setList(RecipeList.create(res.unwrap())))
    else setList(recipes)
  }, [search])

  return (
    <Layout>
      <div className={styles.searchBarRoot}>
        <div className={styles.searchBar}>
          <SearchBar value={search} changeHandler={searchHandler} />
        </div>
      </div>
      {list ? (
        <List recipes={list.remaining.map((recipe) => list.allByID[recipe])} />
      ) : (
        '...loading'
      )}
    </Layout>
  )
}
