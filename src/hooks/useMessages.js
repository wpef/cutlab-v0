import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useMessages(contactRequestId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(!!contactRequestId)

  const fetch = useCallback(async () => {
    if (!contactRequestId) return
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', contactRequestId)
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
    setLoading(false)
  }, [contactRequestId])

  useEffect(() => { fetch() }, [fetch])

  return { messages, loading, refetch: fetch }
}
