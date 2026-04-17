'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

interface AnimationProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0, ...props }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideInLeft({ children, className, delay = 0, ...props }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideInRight({ children, className, delay = 0, ...props }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className, delay = 0, ...props }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className, ...props }: AnimationProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, ...props }: AnimationProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
