import { useEffect, useRef, useState } from 'react'
import styles from './FlipCard.module.css'

export type CardContent = string 

type CardProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> & {
  content: CardContent,
  flipDurationMillis?: number,
  backgroundColor?: string,
  borderColor?: string,
  perspective?: boolean
}

type FlipCardProps = CardProps & {
  state: 'front' | 'back'
}

type ClockPanelProps = CardProps & {
  width: number
  height: number
}

export function ClockPanel({ 
    width, 
    height, 
    content, 
    flipDurationMillis = 1000,
    backgroundColor = "#2c2e35", 
    borderColor = "black", 
    perspective = true, 
    ...props }: ClockPanelProps) {

  const currentValue = useRef<string>('0') 
  const perspectiveStyle = (perspective) ? styles.perspective : ''
  
  useEffect(() => {
    currentValue 
  }, [content])

  return (
    <div 
      className={`${styles.clockPanel} ${perspectiveStyle}`} {...props}
      style={{ width, height, fontSize: height, backgroundColor }}
    >
      <StaticCard content={content} backgroundColor={backgroundColor} />
      <FlipCard state='front' content={content} backgroundColor={backgroundColor} />
    </div>
  ) 
}

function StaticCard({ content, backgroundColor, className, ...props }: CardProps) {
  const cardStyle = `${styles.card} ${styles.cardStatic} ${className ?? ''}`
  return (
    <div className={cardStyle} {...props}>
      <div className={styles.cardLeaf} style={{ backgroundColor }}>
        <div className={`${styles.cardContent} ${styles.cardContentTop}`}>
          {content} 
        </div>
      </div>
      <div className={styles.cardLeaf} style={{ backgroundColor }}>
        <div className={`${styles.cardContent} ${styles.cardContentBottom}`}>
          {content}
        </div>
      </div>
    </div>
  ) 
}

function FlipCard({ content, flipDurationMillis = 1000, backgroundColor }: FlipCardProps) {
  // TODO: перенести функции анимации в родительский компонен
  const requestRef = useRef<number>(null)
  const startAnimationTimeRef = useRef<number>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  function animate(time: number): void {
    if (!startAnimationTimeRef.current) {
      startAnimationTimeRef.current = time
    }
    const timeFraction = Math.min(Math.max(0, (time - startAnimationTimeRef.current) / flipDurationMillis), 1)
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateX(${-180 * timeFraction}deg)`
    }
    if (timeFraction < 1) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      startAnimationTimeRef.current = null
      cancelAnimationFrame(requestRef.current!!)
      requestRef.current = null
    }
  }  
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) 
        cancelAnimationFrame(requestRef.current)
    } 
  }, [content])
  
  return (
    <div className={styles.cardFlip} ref={cardRef}>
      <StaticCard className={styles.cardFlipContent} content={content} backgroundColor={'yellow'}
        style={{
          transform: 'rotateX(0deg)' 
        }}
       />
      <StaticCard className={styles.cardFlipContent} content={content} backgroundColor={'green'} 
        style={{
          transform: 'rotateX(180deg)' 
        }}
      />
        
    </div> 
  ) 
}