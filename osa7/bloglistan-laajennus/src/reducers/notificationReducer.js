import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  color: 'success'
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return {
        message: action.payload.message,
        color: action.payload.color
      }
    },
    resetNotification() {
      return initialState
    }
  }
})

export const { showNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (message, color) => {
  return async (dispatch) => {
    dispatch(
      showNotification({
        message: message,
        color: color
      })
    )
    setTimeout(() => {
      dispatch(resetNotification())
    }, 3000)
  }
}
