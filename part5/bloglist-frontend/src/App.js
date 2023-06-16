import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging with the following credentials: ', username, password)
    try {
      const userToLogin = await loginService.login({ username, password })
      setUser(userToLogin)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Incorrect credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  if(user == null) {
    return (
      <div>
        <h2>Log in to view Blogs</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            Username <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            Password <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} has logged into the application</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App