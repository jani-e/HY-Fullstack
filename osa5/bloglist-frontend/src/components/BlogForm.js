import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title, author, url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>title:
          <input type="text" value={title} name="title" id="title" onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>author:
          <input type="text" value={author} name="author" id="author" placeholder="write author here" onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>url:
          <input type="text" value={url} name="url" id="url" onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit" id="create-button">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm