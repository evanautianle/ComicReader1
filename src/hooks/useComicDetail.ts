import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Comic = {
  id: string
  title: string
  author: string | null
  description: string | null
  cover_url: string | null
}

type Chapter = {
  id: string
  title: string | null
  number: number | null
}

type UseComicDetailResult = {
  comic: Comic | null
  chapters: Chapter[]
  error: string | null
  isFavorite: boolean
  favoriteLoading: boolean
  toggleFavorite: () => Promise<void>
}

export default function useComicDetail(
  comicId: string | undefined,
): UseComicDetailResult {
  const [comic, setComic] = useState<Comic | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    if (!comicId) return

    const fetchData = async () => {
      setError(null)
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError) {
        setError(sessionError.message)
        return
      }

      setUserId(sessionData.session?.user?.id ?? null)

      const { data: comicData, error: comicError } = await supabase
        .from('comics')
        .select('id, title, author, description, cover_url')
        .eq('id', comicId)
        .single()

      if (comicError) {
        setError(comicError.message)
        return
      }

      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('id, title, number')
        .eq('comic_id', comicId)
        .order('number', { ascending: true })

      if (chapterError) {
        setError(chapterError.message)
        return
      }

      setComic(comicData)
      setChapters(chapterData ?? [])
    }

    fetchData()
  }, [comicId])

  useEffect(() => {
    if (!comicId || !userId) {
      setFavoriteId(null)
      return
    }

    const fetchFavorite = async () => {
      const { data, error: favoriteError } = await supabase
        .from('favorites')
        .select('id')
        .eq('comic_id', comicId)
        .eq('user_id', userId)
        .maybeSingle<{ id: number }>()

      if (favoriteError) {
        setError(favoriteError.message)
        return
      }

      setFavoriteId(data?.id ?? null)
    }

    fetchFavorite()
  }, [comicId, userId])

  const toggleFavorite = async () => {
    if (!comicId || !userId) return

    setFavoriteLoading(true)
    setError(null)

    if (favoriteId) {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (deleteError) {
        setError(deleteError.message)
      } else {
        setFavoriteId(null)
      }
    } else {
      const { data, error: insertError } = await supabase
        .from('favorites')
        .insert({ comic_id: comicId, user_id: userId })
        .select('id')
        .single<{ id: number }>()

      if (insertError) {
        setError(insertError.message)
      } else {
        setFavoriteId(data.id)
      }
    }

    setFavoriteLoading(false)
  }

  return {
    comic,
    chapters,
    error,
    isFavorite: Boolean(favoriteId),
    favoriteLoading,
    toggleFavorite,
  }
}
