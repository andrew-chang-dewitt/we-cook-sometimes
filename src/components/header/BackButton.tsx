// external dependencies
import React from 'react'
import { useHistory } from 'react-router-dom'

// other components
// import Back from '../icons/Back'

// CSS-modules
// import styles from './BackButton.module.sass'

export default () => {
  const history = useHistory()

  return (
    <button aria-label="Go Back" onClick={history.goBack}>
      Back
    </button>
  )
}
