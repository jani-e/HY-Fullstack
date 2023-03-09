import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    resetUser() {
      return null
    }
  }
})

export default userSlice.reducer
export const { setUser, resetUser } = userSlice.actions

export const loginUser = (user) => {
  return async (dispatch) => {
    await blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(resetUser())
  }
}
