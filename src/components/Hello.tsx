import * as React from 'react'

// import styles from './Hello.module.sass'
import styles from './Hello.module.css'

export class Hello extends React.Component {
  render() {
    return <h1 className={styles.title}>Hello world!</h1>
  }
}
