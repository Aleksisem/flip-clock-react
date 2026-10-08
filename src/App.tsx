import styles from './App.module.css'
import { Clock } from './components/Clock/Clock'

function App() {
  return (
    <div id={styles.root}>
      <Clock />
    </div>
  )
}

export default App
