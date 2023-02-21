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

export const setNotification = (message, seconds) => {
    return async dispatch => {
        dispatch(showNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, seconds * 1000)
    }
}

export default notificationSlicer.reducer