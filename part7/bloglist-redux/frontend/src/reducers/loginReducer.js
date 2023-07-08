import { createSlice } from '@reduxjs/toolkit'
import blogSerivce from '../services/blogs'
import loginService from '../services/login'
import { setNotificationMessage } from './notificationReducer'

const loginLogoutSlice = createSlice({
  name: 'auth',
  initialState: [],
  reducers: {
    initializeUser(state, action) {
      return action.payload
    },
    loginUser(state, action) {
      return action.payload
    },
    logoutUser() {
      return null
    }
  }
})

export const { initializeUser, loginUser, logoutUser } = loginLogoutSlice.actions

export const loggedInUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(initializeUser(user))
      blogSerivce.setToken(user.token)
    }
  }
}

export const login = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogSerivce.setToken(user.token)
      dispatch(loginUser(user))
      dispatch(setNotificationMessage(`${user.username} successfully logged in`, 5))
    }
    catch(exception) {
      dispatch(setNotificationMessage('Incorrect username or password', 5))
    }
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.clear()
    dispatch(logoutUser())
  }
}

export default loginLogoutSlice.reducer