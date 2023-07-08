import { createSlice } from '@reduxjs/toolkit'


const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification() {
      return ''
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotificationMessage = (notificationMessage, timeoutValue) => {
  return dispatch => {
    dispatch(showNotification(notificationMessage))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeoutValue * 1000)
  }
}

export default notificationSlice.reducer