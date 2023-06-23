import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        handleNotification(state, action) {
            return action.payload
        }
    }
})

export const { handleNotification } = notificationSlice.actions
export default notificationSlice.reducer