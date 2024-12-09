"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
}
interface TimeLeft {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  [key: string]: number | undefined
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  function calculateTimeLeft(): TimeLeft {
    const difference = +targetDate - +new Date()
    let timeLeft: TimeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const timerComponents = Object.keys(timeLeft).map((interval: string) => {
    if (!timeLeft[interval]) {
      return null
    }

    return (
      <span className="mx-1 text-2xl font-bold" key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    )
  })

  return (
    <div className="text-white">
      <h2 className="mb-2 text-xl font-semibold">Opening in:</h2>
      {timerComponents.length ? timerComponents : <span>We're now open!</span>}
    </div>
  )
}
