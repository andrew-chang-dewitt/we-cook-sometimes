import * as React from 'react'

import styles from './Hello.module.sass'

export class Hello extends React.Component {
  render() {
    return <h1 className={styles.title}>Hello world!</h1>
  }
}
