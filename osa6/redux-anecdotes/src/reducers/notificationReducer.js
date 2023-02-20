import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    content: '',
    visible: false
}

const notificationSlicer = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification(state, action) {
            return {
                content: action.payload,
                visible: true
            }
        },
        clearNotification(state, action) {
            return initialState
        }
    }
})

export const { showNotification, clearNotification } = notificationSlicer.actions
export default notificationSlicer.reducer