import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

// const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = action.payload
    return state.map(anecdote => anecdote.id !== id ? anecdote : anecdoteToChange)
  },
  // createNewAnecdote(state, action) {
  //   const newAnecdote = action.payload
  //   console.log("The new anecdote: ", newAnecdote)
  //   state.push({
  //     content: newAnecdote,
  //     id: getId(),
  //     votes: 0
  //   })
  // },
  appendAnecdote(state, action) {
    state.push(action.payload)
  },
  setAnecdote(state, action) {
    return action.payload
  }
}
})

export const { voteAnecdote, appendAnecdote, setAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const createNewAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNewAnecdote(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVotes = id => {
  return async dispatch => {
    const newVote = await anecdoteService.updateVotes(id)
    dispatch(voteAnecdote(newVote))
  }
}

export default anecdoteSlice.reducer