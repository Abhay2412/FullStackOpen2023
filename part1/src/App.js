const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const Footer = () => {
  return (
    <div>
      greeting app created by <a href="https://github.com/Abhay2412">Abhay Khosla</a>
    </div>
  )
}

const App = () => {
  const name = "Stephen Curry"
  const age = 35
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Barry Allen" age={20+13}/>
      <Hello name={name} age={age}/>
      <Footer/>
    </div>
  )
}
export default App