import { Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, color } = useSelector((state) => state.notification)

  if (message === '') {
    return null
  }

  return <Alert variant={color}>{message}</Alert>
}

export default Notification
