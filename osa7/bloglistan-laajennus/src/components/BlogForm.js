import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Label>title</Form.Label>
        <Form.Control
          type='text'
          value={title}
          name='title'
          id='title'
          placeholder='write title here'
          onChange={({ target }) => setTitle(target.value)}
        />

        <Form.Label>author</Form.Label>
        <Form.Control
          type='text'
          value={author}
          name='author'
          id='author'
          placeholder='write author here'
          onChange={({ target }) => setAuthor(target.value)}
        />

        <Form.Label>url</Form.Label>
        <Form.Control
          type='text'
          value={url}
          name='url'
          id='url'
          placeholder='write url here'
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button variant='success' type='submit' id='create-button'>
          create
        </Button>
      </Form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
