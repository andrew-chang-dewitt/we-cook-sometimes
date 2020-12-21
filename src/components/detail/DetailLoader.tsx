// this whole component is simply a wrapper around the Image component
// that handles the ugly, imperative, I/O stuff; testing it is more
// trouble than it's worth since it relies entirely on outside
// libraries that are assumed to be thoroughly tested & internal
// modules that are thoroughly tested on their own.
/*istanbul ignore file*/
// external libs
import React from 'react'

// core logic
import fetch from '../../lib/data/fetch'
import { RecipeCard, RecipeDetails } from '../../lib/data/schema'

// other components
import Detail from './Detail'

// import styles from './Detail.module.sass'

interface Props {
  recipe: RecipeCard
}

export default ({ recipe }: Props) => {
  const [detail, setDetail] = React.useState<RecipeDetails | null>(null)

  React.useEffect(() => {
    fetch
      .details(recipe.id)
      .then((res) => setDetail(res.unwrap()))
      .catch((e) => {
        // FIXME: better error handling
        throw e
      })
  }, [])

  return <>{detail ? <Detail details={detail} recipe={recipe} /> : null}</>
}
