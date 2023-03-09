import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const User = () => {
  const { id: userId } = useParams()
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs).filter(
    (blog) => blog.user.id === userId
  )

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Blogs:</p>
      <ListGroup>
        {blogs.map((blog) => (
          <ListGroupItem key={blog.id}>{blog.title}</ListGroupItem>
        ))}
      </ListGroup>
    </div>
  )
}

export default User
