import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

// load fonts
import 'typeface-vollkorn'
import 'typeface-montserrat'

// load global styles
import './styles/global.sass'

// load root component
import Root from './components/Root'

// and render it wrapped in a Router instance
ReactDOM.render(
  <Router>
    <Root />
  </Router>,
  document.getElementById('app-root')
)
