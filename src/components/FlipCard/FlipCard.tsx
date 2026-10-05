import { useEffect, useState } from 'react'
import styles from './FlipCard.module.css'

export type CardContent = {
  top: string
  bottom: string
}

type CardProps = {
  content: CardContent 
}

type ClockPanelProps = CardProps & {
  width: number
  height: number
}


export function ClockPanel({ width, height, content, ...props }: ClockPanelProps) {
  return (
    <div 
      className={styles.clockPanel} {...props}
      style={{ width, height, fontSize: height }}
    >
      <StaticCard content={content} />
      {/* <FlipCard content={content} /> */}
    </div>
  ) 
}

function StaticCard({ content }: CardProps) {
  return (
    <div className={`${styles.card} ${styles.cardStatic}`}>
      <div className={styles.cardLeaf}>
        <div className={`${styles.cardContent} ${styles.cardContentTop}`}>
          {content.top} 
        </div>
      </div>
      <div className={styles.cardLeaf}>
        <div className={`${styles.cardContent} ${styles.cardContentBottom}`}>
          {content.bottom}
        </div>
      </div>
    </div>
  ) 
}

function FlipCard({ content }: CardProps) {
  return (
    <div className={`${styles.card} ${styles.cardFlip}`}>
    </div> 
  )
}