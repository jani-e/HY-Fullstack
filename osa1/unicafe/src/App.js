import { useState } from 'react'

const Button = ({ buttonClick, buttonName }) => <button onClick={buttonClick}>{buttonName}</button>

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = (props) => {
  const {good, neutral, bad} = props
  const all = good + neutral + bad
  const average = (good + neutral * 0 + bad * -1) / all
  const positive = good * 100 / all
  const positiveWithPercentSign = `${positive} %`

  if (all === 0) {
    return <div>No feedback given</div>
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text='good' value={good} />
        <StatisticsLine text='neutral' value={neutral} />
        <StatisticsLine text='bad' value={bad} />
        <StatisticsLine text='all' value={all} />
        <StatisticsLine text='average' value={average} />
        <StatisticsLine text='positive' value={positiveWithPercentSign} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1)
  const incrementNeutral = () => setNeutral(neutral + 1)
  const incrementBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button buttonClick={incrementGood} buttonName='good' />
      <Button buttonClick={incrementNeutral} buttonName='neutral' />
      <Button buttonClick={incrementBad} buttonName='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;