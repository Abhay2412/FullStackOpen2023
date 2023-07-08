import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'
import DisplayBlogs from './components/DisplayBlogs'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logout } from './reducers/loginReducer'
import { initializeAllUsers } from './reducers/userReducer'
import './index.css'
import { AppBar, Button, Container, Toolbar } from '@mui/material'
import UserTable from './components/UserTable'
import { Routes, Route, Link } from 'react-router-dom'
import SingleUserView from './components/SingleUserView'
import SingleBlogView from './components/SingleBlogView'

const App = () => {
  const loggedInUser = useSelector(state => state.loggedInUser)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeAllUsers())
  })

  const Home = () => {
    return (
      <div>
        <h2>Blogs Application</h2>
        <p>{loggedInUser.name} has logged into the application </p>
        <Button variant='outlined' type='submit' onClick={handleLogout}>Logout</Button>
        <p> </p>
        <NewBlogForm/>
        <p> </p>
        <DisplayBlogs/>
      </div>
    )
  }

  const AllBlogs = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <DisplayBlogs/>
      </div>
    )
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    dispatch(logout())
  }
  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <Button color="inherit" component={Link} to='/'>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/blogs">
            Blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          {loggedInUser ? <em>{loggedInUser.name} logged in</em> : <Button color="inherit" component={Link} to="/login"> Login </Button>}
        </Toolbar>
      </AppBar>
      <Notification/>
      <p> </p>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={loggedInUser ? <Home /> : <LoginForm />} />
        <Route path='/blogs' element={<AllBlogs />} />
        <Route path='/users' element={<UserTable/>} />
        <Route path="/users/:id" element={<SingleUserView />} />
        <Route path="/blogs/:id" element={<SingleBlogView />} />
      </Routes>
    </Container>
  )
}

export default App