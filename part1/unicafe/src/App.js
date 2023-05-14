import { useState } from 'react';

const Statistics = (props) => {
  console.log(props)
  const totalFeedBack = props.good + props.neutral + props.bad
  if(totalFeedBack === 0) {
    return (
    <StatisticLine  text="No feedback provided"/>
    )
  }
  return (
    <div>
      <StatisticLine  text="Good Feedback: " value={props.good}/>
      <StatisticLine  text="Neutral Feedback:" value={props.neutral}/>
      <StatisticLine  text="Bad Feedback: " value={props.bad}/>
      <StatisticLine  text="Total Feedback: " value={totalFeedBack}/>
      <StatisticLine  text="Average Feedback: " value={((props.good * 1 + props.neutral * 0 + props.bad * -1) / totalFeedBack).toFixed(1)}/>
      <StatisticLine  text="Percentage of Positive Feedback: " value={((props.good / totalFeedBack) * 100).toFixed(1)}/>
    </div>
  )
}
const StatisticLine  = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}

const Button = (props) => {
  console.log(props)
  return (
    <div>
      <button onClick={props.handleClick} >{props.text}</button>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
  }
  const increaseNeutral = () => {
    setNeutral(neutral + 1)
  }
  const increaseBad = () => {
   setBad(bad + 1)
  }

  return (
    <div>
      <h1>Provide feedback</h1>
      <tr>
        <td><Button handleClick={increaseGood} text="Good"/></td>
        <td><Button handleClick={increaseNeutral} text="Neutral"/></td>
        <td><Button handleClick={increaseBad} text="Bad"/></td>
      </tr>
      <h1>Total Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>

    </div>
  )
}

export default App