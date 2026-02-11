import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type RatingRow = {
  id: number
  rating: number
}

type UseComicRatingsResult = {
  userRating: number | null
  averageRating: number | null
  ratingCount: number
  loading: boolean
  submitLoading: boolean
  error: string | null
  submitError: string | null
  refresh: () => Promise<void>
  setRating: (value: number) => Promise<void>
}

const computeAverage = (ratings: number[]) => {
  if (ratings.length === 0) return null
  const sum = ratings.reduce((total, value) => total + value, 0)
  return sum / ratings.length
}

export default function useComicRatings(
  comicId: string | undefined,
): UseComicRatingsResult {
  const [userId, setUserId] = useState<string | null>(null)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [ratingCount, setRatingCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError) {
        setError(sessionError.message)
        return
      }

      setUserId(sessionData.session?.user?.id ?? null)
    }

    loadUser()
  }, [])

  const refresh = useCallback(async () => {
    if (!comicId) return

    setLoading(true)
    setError(null)

    const { data: ratingRows, error: ratingError } = await supabase
      .from('ratings')
      .select('rating')
      .eq('comic_id', comicId)

    if (ratingError) {
      setError(ratingError.message)
      setLoading(false)
      return
    }

    const ratings = (ratingRows ?? []).map((row) => row.rating as number)
    setRatingCount(ratings.length)
    setAverageRating(computeAverage(ratings))

    if (userId) {
      const { data: userRow, error: userError } = await supabase
        .from('ratings')
        .select('id, rating')
        .eq('comic_id', comicId)
        .eq('user_id', userId)
        .maybeSingle<RatingRow>()

      if (userError) {
        setError(userError.message)
        setLoading(false)
        return
      }

      setUserRating(userRow?.rating ?? null)
    } else {
      setUserRating(null)
    }

    setLoading(false)
  }, [comicId, userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setRating = useCallback(
    async (value: number) => {
      if (!comicId || !userId) {
        setSubmitError('Sign in required.')
        return
      }

      setSubmitLoading(true)
      setSubmitError(null)

      const { data: existing, error: existingError } = await supabase
        .from('ratings')
        .select('id, rating')
        .eq('comic_id', comicId)
        .eq('user_id', userId)
        .maybeSingle<RatingRow>()

      if (existingError) {
        setSubmitError(existingError.message)
        setSubmitLoading(false)
        return
      }

      if (existing?.id) {
        const { error: updateError } = await supabase
          .from('ratings')
          .update({ rating: value })
          .eq('id', existing.id)

        if (updateError) {
          setSubmitError(updateError.message)
          setSubmitLoading(false)
          return
        }
      } else {
        const { error: insertError } = await supabase.from('ratings').insert({
          comic_id: comicId,
          user_id: userId,
          rating: value,
        })

        if (insertError) {
          setSubmitError(insertError.message)
          setSubmitLoading(false)
          return
        }
      }

      setUserRating(value)
      await refresh()
      setSubmitLoading(false)
    },
    [comicId, refresh, userId],
  )

  const result = useMemo(
    () => ({
      userRating,
      averageRating,
      ratingCount,
      loading,
      submitLoading,
      error,
      submitError,
      refresh,
      setRating,
    }),
    [
      averageRating,
      error,
      loading,
      ratingCount,
      refresh,
      setRating,
      submitError,
      submitLoading,
      userRating,
    ],
  )

  return result
}
