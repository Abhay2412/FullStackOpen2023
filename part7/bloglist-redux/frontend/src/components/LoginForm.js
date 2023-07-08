import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'
import { initializeBlogs } from '../reducers/blogReducer'
import Notification from './Notification'
import { TextField, Button } from '@mui/material'
const LoginForm = () => {
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''
    dispatch(login(username, password))
    dispatch(initializeBlogs())
  }


  return (
    <div>
      <h2>Log in to view Blogs</h2>
      <Notification/>
      <form onSubmit={handleLogin}>
        <div>
          <TextField id="username" label='Username' variant='outlined' margin='dense'/>
        </div>
        <div>
          <TextField id="password" type='password' label='Password' variant='outlined' margin='dense'/>
        </div>
        <Button variant='outlined' type='submit' id='login-button'>Login</Button>
      </form>
    </div>
  )
}

export default LoginForm