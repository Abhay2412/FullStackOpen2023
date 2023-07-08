import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const commentSlice = createSlice({
  name: 'comment',
  initialState: [{ id: 1, content: 'Good read' }, { id: 2, content: 'Interesting info' }],
  reducers: {
    setComment(state, action) {
      return action.payload
    },
    addingComment(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setComment, addingComment } = commentSlice.actions

export const initializeAllComments = (id) => {
  return async dispatch => {
    const comments = await blogService.getComment(id)
    dispatch(setComment(comments))
  }
}

export const createNewComments = (id, content) => {
  return async dispatch => {
    const newComment = await blogService.createComment(id, content)
    dispatch(addingComment(newComment))
  }
}

export default commentSlice.reducer