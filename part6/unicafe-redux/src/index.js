import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const good = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }
  const okay = () => {
    store.dispatch({
      type: 'OKAY'
    })
  }
  const bad = () => {
    store.dispatch({
      type: 'BAD'
    })
  }
  const zero = () => {
    store.dispatch({
      type: 'ZERO'
    })
  }

  return (
    <div>
      <button onClick={good}>Good</button> 
      <button onClick={okay}>Okay</button> 
      <button onClick={bad}>Bad</button>
      <button onClick={zero}>Reset Stats</button>
      <div>Good {store.getState().Good}</div>
      <div>Okay {store.getState().Okay}</div>
      <div>Bad {store.getState().Bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)