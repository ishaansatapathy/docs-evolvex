'use client'

import React, { useState, useEffect } from 'react'
import { RoughNotation } from 'react-rough-notation'

export interface RoughMarkProps {
  children: React.ReactNode
  type?: 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket'
  color?: string
  strokeWidth?: number
  padding?: number | [number, number]
  show?: boolean
  animationDuration?: number
  className?: string
}

export function RoughMark({
  children,
  type = 'underline',
  color = '#ef4444',
  strokeWidth = 2,
  padding = 2,
  show = true,
  animationDuration = 800,
  className = '',
}: RoughMarkProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={className}>{children}</span>
  }

  return (
    <RoughNotation
      type={type}
      show={show}
      color={color}
      strokeWidth={strokeWidth}
      padding={padding}
      animationDuration={animationDuration}
    >
      <span className={className}>{children}</span>
    </RoughNotation>
  )
}
