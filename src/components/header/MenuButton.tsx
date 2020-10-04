// external dependencies
import React from 'react'

// other components
import HamburgerIcon from '../icons/HamburgerIcon'

// CSS-modules
// import styles from './BackButton.module.sass'

interface Props {
  open: boolean
  handler: () => void
}

export default ({ open, handler }: Props) => (
  <button aria-label="Navigation Menu" onClick={handler}>
    <HamburgerIcon open={open} />
  </button>
)
