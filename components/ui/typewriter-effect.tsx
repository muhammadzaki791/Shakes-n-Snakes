'use client'

import { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  texts: string[]
  speed?: number
  pauseDuration?: number
  className?: string
}

export function TypewriterEffect({ texts, speed = 80, pauseDuration = 2000, className }: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % texts.length)
        }
      }
    }, isDeleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex, texts, speed, pauseDuration])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  )
}
