import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type ComicSummary = {
  id: string
  title: string
  cover_url: string | null
}

type RatingRow = {
  id: number
  rating: number
  created_at: string
  comic: ComicSummary | null
}

type CommentRow = {
  id: string
  content: string
  created_at: string
  comic: ComicSummary | null
}

type UseUserActivityResult = {
  ratings: RatingRow[]
  comments: CommentRow[]
  loading: boolean
  error: string | null
}

export default function useUserActivity(): UseUserActivityResult {
  const [ratings, setRatings] = useState<RatingRow[]>([])
  const [comments, setComments] = useState<CommentRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true)
      setError(null)

      const { data: userData, error: userError } =
        await supabase.auth.getUser()

      if (userError || !userData.user) {
        setError(userError?.message ?? 'Sign in required.')
        setLoading(false)
        return
      }

      const [{ data: ratingsData, error: ratingsError }, { data: commentsData, error: commentsError }] =
        await Promise.all([
          supabase
            .from('ratings')
            .select('id, rating, created_at, comic:comics(id, title, cover_url)')
            .eq('user_id', userData.user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('comments')
            .select('id, content, created_at, comic:comics(id, title, cover_url)')
            .eq('user_id', userData.user.id)
            .order('created_at', { ascending: false }),
        ])

      if (ratingsError || commentsError) {
        setError(ratingsError?.message ?? commentsError?.message ?? null)
        setLoading(false)
        return
      }

      setRatings((ratingsData as RatingRow[] | null) ?? [])
      setComments((commentsData as CommentRow[] | null) ?? [])
      setLoading(false)
    }

    fetchActivity()
  }, [])

  return { ratings, comments, loading, error }
}
