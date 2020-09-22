import React from 'react'
import ReactDOM from 'react-dom'

// load fonts
import 'typeface-vollkorn'
import 'typeface-montserrat'

// load global styles
import './styles/global.sass'

import Root from './components/Root'

ReactDOM.render(<Root />, document.getElementById('app-root'))
