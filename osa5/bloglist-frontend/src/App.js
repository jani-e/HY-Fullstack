import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notificaton from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(null)

  const [blogCreationVisible, setBlogCreationVisible] = useState(false)

  const hideWhenVisible = { display: blogCreationVisible ? 'none' : '' }
  const showWhenVisible = { display: blogCreationVisible ? '' : 'none' }

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs
        .sort((a, b) => b.likes - a.likes))
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('login successful!')
      setMessageStatus('success')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000)
    } catch (exception) {
      setMessage('wrong username or password')
      setMessageStatus('fail')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setMessage('logout successful!')
    setMessageStatus('success')
    setTimeout(() => {
      setMessage(null)
      setMessageStatus(null)
    }, 3000)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setMessageStatus('success')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000)
    } catch (exception) {
      setMessage(`blog creation failed: ${exception.response.statusText}`)
      setMessageStatus('fail')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000)
    }
    setBlogCreationVisible(false)
  }

  const handleLike = async (blog) => {
    try {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      await blogService.update(blog.id, newBlog)
      setBlogs(blogs
        .map(originalBlog => originalBlog.id !== blog.id ? originalBlog : newBlog)
        .sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      setMessage(`blog update failed: ${exception.response.statusText}`)
      setMessageStatus('fail')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000)
    }
  }

  const deleteBlog = async (blogObject) => {
    if (!(window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`))) {
      return null
    }
    try {
      await blogService.remove(blogObject.id)
      setMessage(`blog ${blogObject.title} removed!`)
      setMessageStatus('success')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000)
      setBlogs(blogs.filter(blog => blogObject.id !== blog.id))
    } catch (exception) {
      setMessage(`blog deletion failed: ${exception.response.statusText}`)
      setMessageStatus('fail')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000)
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notificaton messageStatus={messageStatus} text={message} />
        <form onSubmit={handleLogin}>
          <div>username
            <input type="text" value={username} name="username" onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>password
            <input type="password" value={password} name="password" onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notificaton messageStatus={messageStatus} text={message} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <div style={hideWhenVisible}>
        <button onClick={() => setBlogCreationVisible(true)}>new note</button>
      </div>
      <div style={showWhenVisible}>
        <BlogForm createBlog={addBlog} />
        <button onClick={() => setBlogCreationVisible(false)}>cancel</button>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} deleteBlog={deleteBlog} user={user} />
      )}
    </div>
  )
}

export default App