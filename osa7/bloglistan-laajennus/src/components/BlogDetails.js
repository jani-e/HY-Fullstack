import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createComment,
  incrementBlogLikes,
  removeBlog
} from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'

const BlogDetails = () => {
  const { id: blogId } = useParams()
  const blog = useSelector((state) => state.blogs)
    .filter((b) => b.id === blogId)
    .shift()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const handleLike = async () => {
    try {
      dispatch(incrementBlogLikes(blog, blog.user))
      dispatch(setNotification(`blog '${blog.title}' liked!`, 'success'))
    } catch (exception) {
      dispatch(
        setNotification(
          `blog update failed: ${exception.response.statusText}`,
          'danger'
        )
      )
    }
  }

  const deleteBlog = async () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return null
    }
    try {
      dispatch(removeBlog(blog.id))
      dispatch(setNotification(`blog ${blog.title} removed!`, 'success'))
      navigate('/')
    } catch (exception) {
      dispatch(
        setNotification(
          `blog deletion failed: ${exception.response.statusText}`,
          'danger'
        )
      )
    }
  }

  const handleComment = async () => {
    try {
      dispatch(createComment(blog, comment))
      dispatch(setNotification(`comment '${comment}' added!`, 'success'))
      setComment('')
    } catch (exception) {
      dispatch(
        setNotification(
          `commenting failed failed: ${exception.response.statusText}`,
          'danger'
        )
      )
    }
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes{' '}
        <Button variant='warning' onClick={() => handleLike(blog)}>
          like
        </Button>
      </div>
      <div>added by {blog.user.name}</div>
      {blog.user.username === user.username && (
        <div>
          <Button variant='danger' onClick={() => deleteBlog(blog)}>
            remove
          </Button>
        </div>
      )}
      <div>
        <h3>Comments</h3>
        <div>
          <input
            value={comment}
            onChange={() => setComment(event.target.value)}></input>
          <Button variant='success' onClick={() => handleComment()}>
            Add comment
          </Button>
        </div>
        <ListGroup>
          {blog.comments.map((blogComment) => (
            <ListGroupItem key={blogComment}>{blogComment}</ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </div>
  )
}

export default BlogDetails
