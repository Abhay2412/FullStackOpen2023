import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendedGenre from './components/RecommendedGenre'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_AUTHORS, ALL_BOOKS, USER } from './queries'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (b) => {
    let seen = new Set()
    return b.filter((item) => {
      let k = item.title
      return seen.has(k) ? false: seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })
}



const App = () => {
  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const user = useQuery(USER)
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.BOOK_ADDED
      try {
        window.alert(`${addedBook.title} has been added`)
        updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      }
      catch {
        console.log('Error')
      }
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
    }
  })

  if(authors.loading || books.loading) {
    return <div>The data is being loaded...</div>
  }
  
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>Authors</button> <button onClick={() => setPage('books')}>Books</button> {!token ? <button onClick={() => setPage('login')}>Login</button> : <div> <button onClick={() => setPage('add')}>Add New Book</button> <button onClick={() => setPage('recommend')}>Recommend</button> 
        <button onClick={logout}>Logout</button>
         </div>}
      <p> </p>
      </div>

      <Authors show={page === 'authors'} authors={authors.data.allAuthors} setError={notify} />

      <Books show={page === 'books'} books={books.data.allBooks} />

      <NewBook show={page === 'add'} setError={notify} />

      <LoginForm show={page === 'login'} setToken={setToken} setError={notify} />

      <RecommendedGenre show={page === 'recommend'} user={user.data.me} books={books.data.allBooks} />
    </div>
  )
}

export default App
