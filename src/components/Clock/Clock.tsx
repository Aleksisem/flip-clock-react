import { useEffect, useRef, useState } from 'react'
import { ClockPanel, type CardContent } from '../FlipCard/FlipCard'
import styles from './Clock.module.css'

export function Clock() {
  const [seconds, setSeconds] = useState<CardContent>('00') 
  const clockInterval = useRef<number>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date()
      setSeconds(time.getSeconds().toString().padStart(2, '0'))
    }, 100) 
  }, []) 

  return(
    <div className={styles.clock}>
      <ClockPanel width={120} height={200} content={seconds[0]} />
      <ClockPanel width={120} height={200} content={seconds[1]} />
    </div>
  ) 
}