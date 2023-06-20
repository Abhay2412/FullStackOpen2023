import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    Good: 0,
    Okay: 0,
    Bad: 0
  }

  test('Should return a proper initial state when called with undefined state', () => {
    // eslint-disable-next-line no-unused-vars
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('Good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      Good: 1,
      Okay: 0,
      Bad: 0
    })
  })
  test('Okay is incremented', () => {
    const action = {
      type: 'OKAY'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      Good: 0,
      Okay: 1,
      Bad: 0
    })
  })
  test('Bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      Good: 0,
      Okay: 0,
      Bad: 1
    })
  })
})