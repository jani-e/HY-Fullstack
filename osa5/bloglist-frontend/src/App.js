import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notificaton from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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
      }, 3000);
    } catch (exception) {
      setMessage('wrong username or password')
      setMessageStatus('fail')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000);
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
    }, 3000);
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title, author, url
      })
      setBlogs([...blogs, newBlog])
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage(`a new blog ${title} by ${author} added`)
      setMessageStatus('success')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000);
    } catch (exception) {
      setMessage(`blog creation failed: ${exception.response.statusText}`)
      setMessageStatus('fail')
      setTimeout(() => {
        setMessage(null)
        setMessageStatus(null)
      }, 3000);
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
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>title:
          <input type="text" value={title} name="title" onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>author:
          <input type="text" value={author} name="author" onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>url:
          <input type="text" value={url} name="url" onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App