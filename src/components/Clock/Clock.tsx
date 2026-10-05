import { ClockPanel } from '../FlipCard/FlipCard'
import styles from './Clock.module.css'

export function Clock() {
  return(
    <div className={styles.clock}>
      <ClockPanel width={60} height={100} content={{ top: '3', bottom: '2' }} />
    </div>
  ) 
}