import { useContext, useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import './index.css'
import { useNotificationDispatch } from './notificationContext'
import UserContext from './userContext'
import { getAll, setToken } from './requests'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  const dispatch = useNotificationDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'setUser', payload: user })
      setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''

    console.log('Logging with the following credentials: ', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setToken(user.token)
      userDispatch({ type: 'setUser', payload: user })
      dispatch({ type: 'showNotification', payload: `${user.username} successfully logged in` })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    } catch (exception) {
      dispatch({ type: 'showNotification', payload: 'Incorrect username or password' })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    userDispatch({ type: 'clearUser' })
  }

  const resultQuery = useQuery('blogs', getAll, { retry: 1, refetchOnWindowFocus: false })

  if (resultQuery.isLoading) {
    return <div>The data is being loaded...</div>
  }
  if (resultQuery.isError) {
    return <div>There was a problem in retrieving data from the server</div>
  }

  const blogs = resultQuery.data

  if(user === null) {
    return (
      <div>
        <h2>Log in to view Blogs</h2>
        <Notification/>
        <form onSubmit={handleLogin}>
          <div>
            Username <input type='text' name='Username' id='username'/>
          </div>
          <div>
            Password <input type='password' name='Password' id='password'/>
          </div>
          <button type='submit' id='login-button'>Login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <Notification/>
      <p>{user.name} has logged into the application <button type='submit' onClick={handleLogout}>Logout</button></p>
      <Togglable buttonLabel = "New Blog" ref={blogFormRef}>
        <NewBlogForm />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App