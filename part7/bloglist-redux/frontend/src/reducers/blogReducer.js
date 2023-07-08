import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlog(state, action) {
      return action.payload
    },
    voteBlog(state, action) {
      const id = action.payload.id

      const blogToUpdate = action.payload

      return state.map(blog => blog.id !== id ? blog : blogToUpdate)
    },
    addingBlog(state, action) {
      state.push(action)
    },
    deletingBlog(state, action) {
      state.filter((blog) => blog.id !== action.payload.id)
    }
  }
})

export const { addingBlog, setBlog, voteBlog, deletingBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const updateLikes = blog => {
  return async dispatch => {
    const blogToUpdate = await blogService.update({
      ...blog,
      likes: blog.likes + 1
    })
    dispatch(voteBlog(blogToUpdate))
  }
}


export const createBlogs = content => {
  return async dispatch => {
    const blogToAdd = await blogService.create(content)
    dispatch(addingBlog(blogToAdd))
  }
}

export const deleteBlogs = id => {
  return async dispatch => {
    const blogToDelete = await blogService.remove(id)
    dispatch(deleteBlogs(blogToDelete))
  }
}

export default blogSlice.reducer