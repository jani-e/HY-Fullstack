import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    }
  }
})

export default blogSlice.reducer
export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog, user) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch(addBlog({ ...newBlog, user: { ...user, id: newBlog.user } }))
  }
}

export const incrementBlogLikes = (blog, user) => {
  const newBlog = {
    ...blog,
    likes: blog.likes + 1
  }
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog.id, newBlog)
    dispatch(updateBlog({ ...updatedBlog, user: user }))
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

export const createComment = (blog, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(blog.id, {
      comment: comment
    })
    dispatch(updateBlog({ ...updatedBlog, user: blog.user }))
  }
}
