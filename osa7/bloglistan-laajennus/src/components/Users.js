import { useSelector } from 'react-redux'
import lodash from 'lodash'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = () => {
  const blogs = useSelector((state) => state.blogs)
  const blogsByUsers = lodash.values(
    lodash.groupBy(blogs, (blog) => blog.user.id)
  )

  return (
    <div>
      <h2>Users</h2>
      <Table bordered hover striped>
        <thead>
          <tr>
            <th>User</th>
            <th>Created Blogs</th>
          </tr>
        </thead>
        <tbody>
          {blogsByUsers.map((blogsByUser) => (
            <tr key={blogsByUser[0].user.id}>
              <td>
                <Link to={blogsByUser[0].user.id}>
                  {blogsByUser[0].user.name}
                </Link>
              </td>
              <td>{blogsByUser.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
