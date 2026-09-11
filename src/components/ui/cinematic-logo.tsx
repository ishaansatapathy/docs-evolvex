'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function CinematicLogo({
  size = 40,
  showText = true,
  className = '',
}: {
  size?: number
  showText?: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <motion.div
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.96 }}
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 cursor-pointer"
      >
        {/* Ambient Crimson Glow behind the 3D X */}
        <div className="pointer-events-none absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.45),transparent_70%)] blur-lg opacity-80" />

        {/* The 3D Folded X Emblem */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.png"
          alt="EvolveX"
          width={size}
          height={size}
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_4px_14px_rgba(239,68,68,0.35)] transition-transform duration-300"
        />
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="relative group flex items-baseline">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Evolve
              </span>
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#ef4444]">
                X
              </span>
              <div className="absolute -bottom-0.5 right-0 w-[45%] h-[2px] bg-[#ef4444] rounded-full opacity-70" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
