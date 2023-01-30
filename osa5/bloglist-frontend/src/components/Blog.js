import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, deleteBlog, user }) => {
  const [expand, setExpand] = useState(false)

  const hideWhenExpanded = { display: expand ? 'none' : '' }
  const showWhenExpanded = { display: expand ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenExpanded} className={'narrow'}>
        {blog.title} {blog.author} <button onClick={() => setExpand(true)}>view</button>
      </div>
      <div style={showWhenExpanded} className={'expanded'}>
        <div>
          {blog.title} {blog.author} <button onClick={() => setExpand(false)}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        {blog.user.username === user.username && (
          <div>
            <button onClick={() => deleteBlog(blog)}>remove</button>
          </div>)
        }
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog