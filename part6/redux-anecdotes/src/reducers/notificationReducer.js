import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        handleNotification(state, action) {
            return action.payload
        },
        hideNotification(state, action) {
            return ''
        }
    }
})

export const { handleNotification, hideNotification } = notificationSlice.actions

export const setNotification = (notificationText, timeoutValue) => {
    return dispatch => {
        dispatch(handleNotification(notificationText))
        setTimeout(() => {
            dispatch(hideNotification())
        }, timeoutValue * 1000)
    }
}


export default notificationSlice.reducer