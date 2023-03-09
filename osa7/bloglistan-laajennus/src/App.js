import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, initializeBlogs } from './reducers/blogReducer'
import { loginUser, logoutUser } from './reducers/userReducer'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogDetails from './components/BlogDetails'
import { Button, Form, Navbar, Nav } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.user)

  const [blogCreationVisible, setBlogCreationVisible] = useState(false)

  const hideWhenVisible = { display: blogCreationVisible ? 'none' : '' }
  const showWhenVisible = { display: blogCreationVisible ? '' : 'none' }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector(({ blogs }) => {
    return [...blogs].sort((a, b) => b.likes - a.likes)
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loginUser(user))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      dispatch(loginUser(user))
      setUsername('')
      setPassword('')
      dispatch(setNotification('login successful!', 'success'))
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 'danger'))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(logoutUser())
    dispatch(setNotification('logout successful!', 'success'))
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      dispatch(createBlog(blogObject, user))
      dispatch(
        setNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`,
          'success'
        )
      )
    } catch (exception) {
      dispatch(
        setNotification(
          `blog creation failed: ${exception.response.statusText}`,
          'danger'
        )
      )
    }
    setBlogCreationVisible(false)
  }

  if (user === null) {
    return (
      <div className='container'>
        <h2>Log in to application</h2>
        <Notification />
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username</Form.Label>
            <Form.Control
              type='text'
              value={username}
              id='username'
              name='username'
              onChange={({ target }) => setUsername(target.value)}
            />
            <Form.Label>password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              id='password'
              name='password'
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button variant='success' type='submit' id='login'>
              login
            </Button>
          </Form.Group>
        </Form>
      </div>
    )
  }

  const Blogs = () => {
    return (
      <div>
        <div style={hideWhenVisible}>
          <Button variant='info' onClick={() => setBlogCreationVisible(true)}>
            create new blog
          </Button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm createBlog={addBlog} />
          <Button
            variant='outline-secondary'
            onClick={() => setBlogCreationVisible(false)}>
            cancel
          </Button>
        </div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    )
  }

  return (
    <div className='container'>
      <Navbar collapseOnSelect expand='lg' bg='info' variant='info'>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='#' as='span'>
              <Link to='/'>Blogs</Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <Link to='/users'>Users</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text>{user.name} logged in</Navbar.Text>
          <Button variant='secondary' onClick={handleLogout}>
            logout
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <h2>Blogs</h2>
      <Notification />
      <Routes>
        <Route path='/' element={<Blogs />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/blogs/:id' element={<BlogDetails />} />
      </Routes>
    </div>
  )
}

export default App
