import { memo, useEffect, useRef, useState, type RefObject } from 'react'
import styles from './FlipCard.module.css'

export type CardData = {
  current: string
  next: string
} 

type CardContent = {
  top: string,
  bottom: string
}

type CardOptions = {
  flipDurationMillis?: number 
  backgroundColor?: string
  borderColor?: string
  perspective?: boolean
  borderRadius?: string
}

type CardProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> & {
} & CardOptions

type StaticCardProps = CardProps & {
  content: CardContent
}

type FlipCardProps<T> = CardProps & {
  ref: RefObject<T | null>
  content: CardData
  isFlipped: boolean
}

type ClockPanelProps = {
  width: number
  height: number
  value: string,
} & CardOptions

export const ClockPanel = memo(function ClockPanel({ 
    width, 
    height, 
    value, 
    flipDurationMillis = 700,
    backgroundColor = "#2c2e35", 
    borderColor = "black", 
    borderRadius = "10px",
    perspective = true, 
    ...props }: ClockPanelProps) {

  const perspectiveStyle = (perspective) ? styles.perspective : ''
  const valueDisplayed = useRef<string>('0')
  
  const requestRef = useRef<number>(null)
  const startAnimationTimeRef = useRef<number>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const flipCardRotationAngle = useRef<number>(0)

  function flipCardAnimate(time: number): void {
    if (!cardRef.current) return
    if (!startAnimationTimeRef.current) {
      startAnimationTimeRef.current = time
    }
    const timeFraction = Math.min(Math.max(0, (time - startAnimationTimeRef.current) / flipDurationMillis), 1)
    const startAngle = flipCardRotationAngle.current 
    let rotationAngle = (startAngle + (-180 * timeFraction)) % 360

    cardRef.current.style.transform = `rotateX(${rotationAngle}deg)`

    if (timeFraction < 1) {
      requestRef.current = requestAnimationFrame(flipCardAnimate)
    } else {
      startAnimationTimeRef.current = null
      cancelAnimationFrame(requestRef.current!!)
      requestRef.current = null
      // Update displayed value after card has flipped
      valueDisplayed.current = value
      flipCardRotationAngle.current = rotationAngle
      console.log(`rotationAngle: ${flipCardRotationAngle.current}`)
    }
  }  
  
  useEffect(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      startAnimationTimeRef.current = null
    }

    requestRef.current = requestAnimationFrame(flipCardAnimate)
    return () => {
      if (requestRef.current) 
        cancelAnimationFrame(requestRef.current)
    } 

  }, [value])
  
  const cardData = {
    current: valueDisplayed.current,
    next: value
  }
  
  const isCardFlipped = Math.abs(flipCardRotationAngle.current) >= 180 

  return (
    <div 
      className={`${styles.clockPanel} ${perspectiveStyle}`} {...props}
      style={{ width, height, fontSize: height, backgroundColor, borderRadius }}
    >
      <StaticCard content={{ top: cardData.next, bottom: cardData.current }} backgroundColor={backgroundColor} borderRadius={borderRadius} />
      <FlipCard ref={cardRef} content={cardData} isFlipped={isCardFlipped} backgroundColor={backgroundColor} borderRadius={borderRadius} />
    </div>
  ) 
})

function StaticCard({ content, backgroundColor, className, borderRadius, ...props }: StaticCardProps) {
  const cardStyle = `${styles.card} ${styles.cardStatic} ${className ?? ''}`
  return (
    <div className={cardStyle} style={{ borderRadius: borderRadius }} {...props} >
      <div className={styles.cardLeaf} style={{ backgroundColor }}>
        <div className={`${styles.cardContent} ${styles.cardContentTop}`}>
          {content.top} 
        </div>
      </div>
      <div className={styles.cardLeaf} style={{ backgroundColor }}>
        <div className={`${styles.cardContent} ${styles.cardContentBottom}`}>
          {content.bottom}
        </div>
      </div>
    </div>
  ) 
}

function FlipCard({ content, ref, isFlipped, backgroundColor, borderRadius }: FlipCardProps<HTMLDivElement>) {
  const frontCardContent = {
    top: isFlipped ? content.next : content.current, 
    bottom: isFlipped ? content.next : content.current
  }
  const backCardContent = {
    top: isFlipped ? content.current : content.next, 
    bottom: isFlipped ? content.current : content.next
  }
  return (
    <div className={styles.cardFlip} ref={ref} style={{ borderRadius }}>
      <StaticCard className={styles.cardFlipContent} content={frontCardContent} backgroundColor={backgroundColor} borderRadius={borderRadius}
        style={{
          transform: 'rotateX(0deg)',
          borderRadius 
        }}
       />
      <StaticCard className={styles.cardFlipContent} content={backCardContent} backgroundColor={backgroundColor}  borderRadius={borderRadius}
        style={{
          transform: 'rotateX(180deg)',
          borderRadius 
        }}
      />
        
    </div> 
  ) 
}