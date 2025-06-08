'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface TimeAgoProps {
  dateString: string;
}

export default function TimeAgo({ dateString }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    // This code only runs on the client, after hydration
    setTimeAgo(formatDistanceToNow(new Date(dateString)) + ' ago')
  }, [dateString])

  // Render a placeholder or nothing on the server
  if (!timeAgo) {
    return null;
  }

  return <span>{timeAgo}</span>
}
