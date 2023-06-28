import { useState } from 'react'
import { useField } from './hooks'
import { BrowserRouter as Router, Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'


const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/anecdotes' style={padding}>Anecdotes</Link>
      <Link to='/create' style={padding}>Create New</Link>
      <Link to='/about' style={padding}>About</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} > <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></li>)}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/Abhay2412/FullStackOpen2023'>https://github.com/Abhay2412/FullStackOpen2023</a> for the source code in "part7" directory.
  </div>
)

const SingleAnecdote = ({ anecdote }) => {
  return (
    <div>
      <h1>{anecdote.content}</h1>
      <p>Has this many votes {anecdote.votes}</p>
      <p>To visit the anecdote for more info see: {anecdote.info}</p>
    </div>
  )
}

const CreateNew = (props) => {
  const navigate = useNavigate()
  // const [content, setContent] = useState('')
  // const [author, setAuthor] = useState('')
  // const [info, setInfo] = useState('')
  const {reset: resetContent, ...fieldContent} = useField('content')
  const {reset: resetAuthor, ...fieldAuthor} = useField('author')
  const {reset: resetInfo, ...fieldInfo} = useField('info')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: fieldContent.value,
      author: fieldAuthor.value,
      info: fieldInfo.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }
  
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Content <input {...fieldContent} />
        </div>
        <div>
          Author <input {...fieldAuthor} />
        </div>
        <div>
          URL for more info <input {...fieldInfo}  />
        </div>
        <button>Create</button>
        <button onClick={handleReset}>Reset</button>
      </form>
    </div>
  )
  
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])
  
  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`You created a new anecdote with the following content: ${anecdote.content}`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }
  
  const anecdoteById = (id) =>
  anecdotes.find(a => a.id === id)
  
  const vote = (id) => {
    const anecdote = anecdoteById(id)
    
    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    
    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
  
  const match = useMatch('/anecdotes/:id')

  const anecdote = match ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id)) : null
  
  return (
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        {notification}
        <Routes>
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes}/>} />
          <Route path='/anecdotes' element={<AnecdoteList anecdotes={anecdotes}/>} />
          <Route path='/anecdotes/:id' element={<SingleAnecdote anecdote={anecdote}/>} />
          <Route path='/create' element={<CreateNew addNew={addNew} />} />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
  )
}

export default App
